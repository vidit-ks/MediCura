import supabase from '../lib/supabase.js'
import { createRequire } from 'module'
import FormData from 'form-data'
import fetch from 'node-fetch'

const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

const CLOUDINARY_URL   = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload`
const CLOUDINARY_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'Medicare'

/* ─────────────────────────────────────────
   1. Upload file to Cloudinary
───────────────────────────────────────── */
const uploadToCloudinary = async (buffer, filename) => {
  try {
    const fd = new FormData()
    fd.append('file', buffer, { filename, contentType: 'application/octet-stream' })
    fd.append('upload_preset', CLOUDINARY_PRESET)
    fd.append('resource_type', 'raw')
    const res  = await fetch(CLOUDINARY_URL, { method: 'POST', body: fd })
    const data = await res.json()
    return data.secure_url || null
  } catch { return null }
}

/* ─────────────────────────────────────────
   2. Extract text from PDF buffer
───────────────────────────────────────── */
const extractTextFromPDF = async (buffer) => {
  try {
    const parsed = await pdfParse(buffer)
    return (parsed.text || '').trim()
  } catch (e) {
    console.log('pdf-parse error:', e.message)
    return ''
  }
}

/* ─────────────────────────────────────────
   3. Regex-based extractor (fast, reliable)
   Handles table-formatted EHR PDFs like:
   "Patient Name  Rahul Sharma"
───────────────────────────────────────── */
const extractWithRegex = (text) => {
  if (!text || text.length < 10) return null

  const find = (patterns) => {
    for (const p of patterns) {
      const m = text.match(p)
      if (m?.[1]?.trim()) return m[1].trim()
    }
    return null
  }

  const findList = (patterns) => {
    const val = find(patterns)
    if (!val) return []
    return val.split(/[,;]+/).map(s => s.trim()).filter(Boolean)
  }

  const result = {
    patient_name: find([
      /Patient\s*Name[:\s\t]+([^\n\r]+)/i,
      /Name[:\s\t]+([^\n\r]+)/i,
    ]),
    age: find([
      /Age[:\s\t]+([^\n\r]+)/i,
      /(\d{1,3})\s*(?:years?|yrs?)/i,
    ]),
    doctor_name: find([
      /Doctor[:\s\t]+([^\n\r]+)/i,
      /Physician[:\s\t]+([^\n\r]+)/i,
      /Consultant[:\s\t]+([^\n\r]+)/i,
      /Dr\.?\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/,
    ]),
    diagnosis: find([
      /Diagnosis[:\s\t]+([^\n\r]+)/i,
      /Impression[:\s\t]+([^\n\r]+)/i,
      /Condition[:\s\t]+([^\n\r]+)/i,
    ]),
    symptoms: findList([
      /Symptoms?[:\s\t]+([^\n\r]+)/i,
      /Chief\s*Complaint[:\s\t]+([^\n\r]+)/i,
      /Presenting\s*Complaint[:\s\t]+([^\n\r]+)/i,
    ]),
    medicines: findList([
      /Medications?[:\s\t]+([^\n\r]+)/i,
      /Medicines?[:\s\t]+([^\n\r]+)/i,
      /Prescription[:\s\t]+([^\n\r]+)/i,
      /Treatment[:\s\t]+([^\n\r]+)/i,
    ]),
    follow_up: find([
      /(?:Doctor\s*)?Advice[:\s\t]+([^\n\r]+)/i,
      /Follow[\s-]*up[:\s\t]+([^\n\r]+)/i,
      /Instructions?[:\s\t]+([^\n\r]+)/i,
      /Recommendation[:\s\t]+([^\n\r]+)/i,
    ]),
  }

  // Extract lab values (e.g. "Haemoglobin: 13.5 g/dL")
  const labRegex = /(Haemoglobin|Hemoglobin|HbA1c|Blood Sugar|WBC|RBC|Platelets?|Cholesterol|Creatinine|Urea|Sodium|Potassium|CRP|TSH|Bilirubin)[:\s]+([0-9.,]+\s*[a-zA-Z%/μ]*)/gi
  const lab_values = {}
  let m
  while ((m = labRegex.exec(text)) !== null) {
    lab_values[m[1]] = m[2].trim()
  }
  if (Object.keys(lab_values).length) result.lab_values = lab_values

  // Generate summary from what we found
  const parts = []
  if (result.patient_name) parts.push(`Patient ${result.patient_name}`)
  if (result.age)          parts.push(`age ${result.age}`)
  if (result.diagnosis)    parts.push(`diagnosed with ${result.diagnosis}`)
  if (result.medicines?.length) parts.push(`prescribed ${result.medicines.join(', ')}`)
  if (result.follow_up)    parts.push(result.follow_up)
  result.summary = parts.length > 0 ? parts.join('. ') + '.' : null

  // Return null if nothing was extracted
  const hasData = Object.values(result).some(v =>
    v && (Array.isArray(v) ? v.length > 0 : true) && v !== result.summary
  )
  return hasData ? result : null
}

/* ─────────────────────────────────────────
   4. HuggingFace AI analysis (optional enhancement)
───────────────────────────────────────── */
const analyzeWithAI = async (text) => {
  if (!process.env.HF_TOKEN || text.length < 30) return null
  try {
    const snippet = text.slice(0, 1200)
    const prompt  = `Extract medical information from this health report as JSON only (no explanation):
${snippet}

Return ONLY valid JSON:
{"patient_name":"...","age":"...","doctor_name":"...","diagnosis":"...","symptoms":["..."],"medicines":["..."],"follow_up":"...","summary":"2 sentence summary"}`

    const res  = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.HF_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 350, temperature: 0.2, return_full_text: false }
        })
      }
    )
    const data = await res.json()
    const raw  = data?.[0]?.generated_text || ''
    const match = raw.match(/\{[\s\S]*?\}/)
    if (match) return JSON.parse(match[0])
  } catch (e) {
    console.log('HF AI skipped:', e.message)
  }
  return null
}

/* ═══════════════════════════════════════════════════
   POST /upload/file  — Main upload handler
═══════════════════════════════════════════════════ */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' })
    }

    const { description } = req.body
    const userId   = req.userId
    const buffer   = req.file.buffer
    const filename = req.file.originalname

    console.log(`📄 EHR Upload: ${filename} (${buffer.length} bytes) for user ${userId}`)

    // 1. Extract PDF text
    const extractedText = await extractTextFromPDF(buffer)
    console.log(`   Extracted text: ${extractedText.length} chars`)

    // 2. Regex extraction (fast, always attempted)
    const regexData = extractWithRegex(extractedText)
    console.log(`   Regex extracted:`, regexData ? Object.keys(regexData).filter(k => regexData[k]) : 'nothing')

    // 3. AI enhancement (async, may timeout)
    let aiData = null
    if (extractedText.length > 20) {
      aiData = await analyzeWithAI(extractedText)
      console.log(`   AI extracted:`, aiData ? 'yes' : 'no')
    }

    // 4. Merge: AI wins where it has data, regex fills gaps
    let finalSummary = null
    if (aiData || regexData) {
      finalSummary = {}
      const base = regexData || {}
      const ai   = aiData   || {}
      const fields = ['patient_name','age','doctor_name','diagnosis','symptoms','medicines','follow_up','summary','lab_values']
      for (const f of fields) {
        const aiv = ai[f]; const rv = base[f]
        const hasAI = aiv && (Array.isArray(aiv) ? aiv.length > 0 : aiv.toString().trim())
        const hasRx = rv  && (Array.isArray(rv)  ? rv.length > 0  : rv.toString().trim())
        finalSummary[f] = hasAI ? aiv : (hasRx ? rv : null)
      }
      // Always regenerate summary if missing
      if (!finalSummary.summary) {
        const parts = []
        if (finalSummary.patient_name) parts.push(`Patient ${finalSummary.patient_name}`)
        if (finalSummary.diagnosis)    parts.push(`diagnosed with ${finalSummary.diagnosis}`)
        if (finalSummary.medicines?.length) parts.push(`prescribed ${finalSummary.medicines.join(', ')}`)
        finalSummary.summary = parts.join(', ') + '.'
      }
    }

    // 5. Upload to Cloudinary
    const downloadUrl = await uploadToCloudinary(buffer, filename)
    console.log(`   Cloudinary:`, downloadUrl ? 'uploaded' : 'skipped')

    // 6. Save to Supabase
    const insertPayload = {
      user_id:        userId,
      filename,
      download_url:   downloadUrl,
      description:    description || filename,
      extracted_text: extractedText.slice(0, 5000) || null,
      ai_summary:     finalSummary ? JSON.stringify(finalSummary) : null,
    }

    const { data: ehr, error } = await supabase
      .from('ehrs')
      .insert(insertPayload)
      .select()
      .single()

    if (error) throw error

    console.log(`   ✅ Saved to DB. has_ai: ${!!finalSummary}`)

    res.status(200).json({
      success: true,
      message: finalSummary
        ? 'Document uploaded and health data extracted successfully!'
        : 'Document uploaded. Could not extract text from this file.',
      data: { ...ehr, ai_summary: finalSummary }
    })

  } catch (e) {
    console.error('❌ EHR upload error:', e)
    res.status(500).json({ success: false, message: e.message || 'Upload failed' })
  }
}

/* ═══════════════════════════════════════════════════
   GET /upload/file — Fetch user's EHR records
═══════════════════════════════════════════════════ */
export const getEHR = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ehrs')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    const enriched = (data || []).map(row => ({
      ...row,
      ai_summary: row.ai_summary
        ? (() => { try { return JSON.parse(row.ai_summary) } catch { return null } })()
        : null
    }))

    res.status(200).json({ success: true, data: enriched })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

/* ═══════════════════════════════════════════════════
   DELETE /upload/file — Delete a record
═══════════════════════════════════════════════════ */
export const deleteEHR = async (req, res) => {
  try {
    const { error } = await supabase
      .from('ehrs')
      .delete()
      .eq('id', req.body.fileid)
      .eq('user_id', req.userId)
    if (error) throw error
    res.status(200).json({ success: true, message: 'Document deleted successfully' })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to delete' })
  }
}

// Backward-compat aliases
export const getAllehr        = getEHR
export const Blockchain      = uploadFile
export const getBlockchainEHR = getEHR
