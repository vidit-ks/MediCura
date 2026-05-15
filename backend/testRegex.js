// Test regex extractor against demo PDF text
const sampleText = `Electronic Health Record (EHR) - Demo Report
Field Details
Patient Name Rahul Sharma
Patient ID EHR-DEMO-001
Age 34
Gender Male
Blood Group B+
Doctor Dr. Ananya Mehta
Department General Medicine
Visit Date 15 May 2026
Symptoms Fever, dry cough, fatigue
Diagnosis Viral Upper Respiratory Tract Infection
Medications Paracetamol, Cetirizine
Doctor Advice Rest, hydration, follow-up in 5 days

Summary: Patient visited with mild viral infection symptoms.`

const find = (patterns) => {
  for (const p of patterns) {
    const m = sampleText.match(p)
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
  patient_name: find([/Patient\s*Name[\s\t]+([^\n\r]+)/i]),
  age:          find([/Age[\s\t]+([^\n\r]+)/i]),
  doctor_name:  find([/Doctor[\s\t]+([^\n\r]+)/i]),
  diagnosis:    find([/Diagnosis[\s\t]+([^\n\r]+)/i]),
  symptoms:     findList([/Symptoms?[\s\t]+([^\n\r]+)/i]),
  medicines:    findList([/Medications?[\s\t]+([^\n\r]+)/i]),
  follow_up:    find([/Doctor\s*Advice[\s\t]+([^\n\r]+)/i, /Follow[\s-]*up[\s\t]+([^\n\r]+)/i]),
}

console.log('=== Regex Extraction Result ===')
Object.entries(result).forEach(([k,v]) => console.log(k + ':', JSON.stringify(v)))
