import { useState } from 'react'
import { BASE_URL } from '../config'
import { toast } from 'react-toastify'
import { BsCloudUploadFill, BsFileMedical, BsCheckCircleFill } from 'react-icons/bs'
import { MdOutlineDescription } from 'react-icons/md'
import HashLoader from 'react-spinners/HashLoader'

const ACCEPTED = '.pdf,.doc,.docx,.jpg,.jpeg,.png'
const FILE_ICONS = {
  pdf: '📄', doc: '📝', docx: '📝', jpg: '🖼️', jpeg: '🖼️', png: '🖼️'
}
const getExt = (name = '') => name.split('.').pop()?.toLowerCase()

const Upload = ({ onUploaded }) => {
  const [desc, setDesc]       = useState('')
  const [file, setFile]       = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)  // AI analysis result

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return toast.warning('Please select a file first')
    if (!desc.trim()) return toast.warning('Please add a description')

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('filename', file)
      fd.append('description', desc)

      const res = await fetch(`${BASE_URL}/upload/file`, {
        method: 'POST',
        body: fd,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Upload failed')

      toast.success('Document uploaded and analyzed!')
      setResult(data.data)
      setFile(null); setDesc('')
      if (onUploaded) onUploaded()
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  /* ── AI Result Card ── */
  if (result) {
    const ai = result.ai_summary
    return (
      <div className="bg-white rounded-2xl border border-green-100 shadow-md p-6 animate-fadeIn">
        <div className="flex items-center gap-3 mb-5">
          <BsCheckCircleFill className="text-green-500 text-[28px]" />
          <div>
            <h3 className="text-headingColor font-bold text-[18px]">Upload Successful!</h3>
            <p className="text-textColor text-[13px]">{result.description}</p>
          </div>
        </div>

        {ai ? (
          <div className="bg-gradient-to-br from-[#F0FAFB] to-[#EBF5FF] rounded-xl p-5 space-y-3">
            <h4 className="text-headingColor font-[700] text-[15px] mb-3 flex items-center gap-2">
              <BsFileMedical className="text-primaryColor" /> AI-Extracted EHR Summary
            </h4>

            {/* Patient Info Row */}
            <div className="grid grid-cols-2 gap-3">
              <InfoBox label="Patient" value={ai.patient_name} />
              <InfoBox label="Age" value={ai.age} />
              <InfoBox label="Doctor" value={ai.doctor_name} />
              <InfoBox label="Follow-up" value={ai.follow_up} />
            </div>

            {/* Diagnosis */}
            {ai.diagnosis && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                <p className="text-[11px] font-semibold text-red-400 uppercase tracking-wide">Diagnosis</p>
                <p className="text-headingColor font-semibold text-[14px] mt-1">{ai.diagnosis}</p>
              </div>
            )}

            {/* Medicines */}
            {ai.medicines?.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-textColor uppercase tracking-wide mb-2">Prescribed Medicines</p>
                <div className="flex flex-wrap gap-2">
                  {ai.medicines.map((m, i) => (
                    <span key={i} className="bg-white border border-primaryColor text-primaryColor text-[12px] font-semibold px-3 py-1 rounded-full">
                      💊 {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Symptoms */}
            {ai.symptoms?.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-textColor uppercase tracking-wide mb-2">Symptoms</p>
                <div className="flex flex-wrap gap-2">
                  {ai.symptoms.map((s, i) => (
                    <span key={i} className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-[12px] font-semibold px-3 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {ai.summary && (
              <div className="bg-white rounded-lg p-3 border border-[#e0eeff]">
                <p className="text-[11px] font-semibold text-textColor uppercase tracking-wide mb-1">AI Summary</p>
                <p className="text-textColor text-[13px] leading-6">{ai.summary}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#F8FBFF] rounded-xl p-4 text-center">
            <p className="text-headingColor font-semibold text-[15px]">✅ File stored successfully</p>
            <p className="text-textColor text-[13px] mt-1">
              AI analysis was not available for this document. Delete and re-upload to get structured health data.
            </p>
          </div>
        )}

        <button
          onClick={() => setResult(null)}
          className="mt-5 w-full border border-solid border-primaryColor text-primaryColor py-3 rounded-xl font-semibold text-[15px] hover:bg-[#f0f6ff] transition-colors"
        >
          Upload Another Document
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Description input */}
      <div className="relative">
        <MdOutlineDescription className="absolute left-3 top-1/2 -translate-y-1/2 text-textColor text-[20px]" />
        <input
          type="text"
          placeholder="File Description (e.g. Blood Test Report – March 2026)"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          required
          className="w-full pl-10 pr-4 py-3 border border-solid border-[#D9DCE2] focus:outline-none focus:border-primaryColor text-[15px] text-headingColor placeholder:text-textColor rounded-xl transition-colors"
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
          ${dragging ? 'border-primaryColor bg-[#EBF5FF]' : 'border-[#D9DCE2] hover:border-primaryColor hover:bg-[#f8fbff]'}
          ${file ? 'bg-green-50 border-green-400' : ''}`}
        onClick={() => document.getElementById('ehr-file-input').click()}
      >
        <input
          id="ehr-file-input"
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={e => setFile(e.target.files[0])}
          required={!file}
        />

        {file ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-[40px]">{FILE_ICONS[getExt(file.name)] || '📎'}</span>
            <p className="text-headingColor font-semibold text-[15px]">{file.name}</p>
            <p className="text-textColor text-[12px]">{(file.size / 1024).toFixed(1)} KB</p>
            <button type="button" onClick={e => { e.stopPropagation(); setFile(null) }}
              className="text-red-500 text-[12px] underline mt-1">Remove</button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <BsCloudUploadFill className="text-[48px] text-[#D9DCE2]" />
            <div>
              <p className="text-headingColor font-semibold text-[15px]">Drag & drop your file here</p>
              <p className="text-textColor text-[13px] mt-1">or click to browse</p>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Supports: PDF, DOC, DOCX, JPG, PNG · Max 5MB</p>
          </div>
        )}
      </div>



      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primaryColor text-white py-3 rounded-xl font-[600] text-[16px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
        style={{ lineHeight: 'normal' }}
      >
        {loading ? (
          <><HashLoader size={20} color="#fff" /> Uploading &amp; Analyzing...</>
        ) : (
          <><BsCloudUploadFill /> Upload &amp; Analyze</>
        )}
      </button>
    </form>
  )
}

const InfoBox = ({ label, value }) => value ? (
  <div className="bg-white rounded-lg px-3 py-2 border border-[#e0eeff]">
    <p className="text-[10px] font-semibold text-textColor uppercase tracking-wide">{label}</p>
    <p className="text-headingColor font-semibold text-[13px] mt-0.5">{value}</p>
  </div>
) : null

export default Upload
