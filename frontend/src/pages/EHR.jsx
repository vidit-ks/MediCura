import { useState } from 'react'
import { BsCloudUploadFill, BsFileMedical, BsShieldCheck } from 'react-icons/bs'
import { MdOutlineHealthAndSafety } from 'react-icons/md'
import Upload from './Upload'
import View from './View'

const EHR = () => {
  const [tab, setTab]       = useState('upload')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploaded = () => {
    setRefreshKey(k => k + 1)
    setTab('view')
  }

  return (
    <section className="py-10">
      <div className="max-w-[1170px] px-5 mx-auto">

        {/* ── Hero Banner ── */}
        <div className="relative bg-gradient-to-r from-[#0067FF] to-[#01B5C5] rounded-3xl p-8 mb-10 overflow-hidden">
          {/* Background decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white opacity-5" />
          <div className="absolute -bottom-10 right-24 w-60 h-60 rounded-full bg-white opacity-5" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <MdOutlineHealthAndSafety className="text-white text-[32px]" />
            </div>
            <div className="flex-1">
              <h1 className="text-white font-[800] text-[26px] leading-tight">
                Electronic Health Records
              </h1>
              <p className="text-white/80 text-[14px] mt-1 max-w-[500px] leading-6">
                Upload your medical documents and let our AI extract patient details,
                diagnosis, medicines, and generate a structured health summary automatically.
              </p>
            </div>
            {/* Feature pills */}
            <div className="flex flex-col gap-2">
              {[
                { icon: <BsShieldCheck />, text: 'Secure Storage' },
                { icon: <BsFileMedical />, text: 'AI Analysis' },
                { icon: <BsCloudUploadFill />, text: 'PDF / Image Support' },
              ].map(f => (
                <div key={f.text} className="flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5">
                  <span className="text-white text-[12px]">{f.icon}</span>
                  <span className="text-white text-[12px] font-medium">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* ── Left Sidebar: What can you upload ── */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E8ECF0] p-5 shadow-sm sticky top-5">
              <h3 className="text-headingColor font-[700] text-[15px] mb-4">📂 Accepted Documents</h3>
              <ul className="space-y-2">
                {[
                  { icon: '📋', label: 'Medical Report PDF' },
                  { icon: '💊', label: 'Prescription' },
                  { icon: '🧪', label: 'Lab / Blood Test Report' },
                  { icon: '🩻', label: 'X-ray / MRI Report' },
                  { icon: '🏥', label: 'Discharge Summary' },
                  { icon: '🦠', label: 'COVID / Infection Report' },
                  { icon: '🖼️', label: 'Medical Image (JPG/PNG)' },
                ].map(d => (
                  <li key={d.label} className="flex items-center gap-3 text-[13px] text-textColor">
                    <span className="text-[16px]">{d.icon}</span>
                    {d.label}
                  </li>
                ))}
              </ul>

              <div className="mt-5 border-t border-[#E8ECF0] pt-4">
                <h3 className="text-headingColor font-[700] text-[14px] mb-3">🤖 AI Extracts</h3>
                <div className="flex flex-wrap gap-2">
                  {['Patient Name', 'Age', 'Doctor', 'Diagnosis', 'Medicines', 'Symptoms', 'Follow-up', 'Summary'].map(t => (
                    <span key={t} className="bg-[#EBF5FF] text-primaryColor text-[11px] font-semibold px-2 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t border-[#E8ECF0] pt-4 bg-[#F0FDF4] rounded-xl p-3">
                <p className="text-green-700 text-[12px] font-semibold flex items-center gap-1">
                  <BsShieldCheck /> Privacy Protected
                </p>
                <p className="text-green-600 text-[11px] mt-1 leading-5">
                  Your medical records are stored securely and only accessible by you.
                </p>
              </div>
            </div>
          </div>

          {/* ── Right Main Panel ── */}
          <div className="md:col-span-2">
            {/* Tab switcher */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setTab('upload')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[14px] border border-solid transition-all
                  ${tab === 'upload'
                    ? 'bg-primaryColor text-white border-primaryColor'
                    : 'bg-white text-headingColor border-[#D9DCE2] hover:border-primaryColor'}`}
              >
                <BsCloudUploadFill /> Upload Doc
              </button>
              <button
                onClick={() => setTab('view')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[14px] border border-solid transition-all
                  ${tab === 'view'
                    ? 'bg-primaryColor text-white border-primaryColor'
                    : 'bg-white text-headingColor border-[#D9DCE2] hover:border-primaryColor'}`}
              >
                <BsFileMedical /> View Records
              </button>
            </div>

            {/* Panel content */}
            <div className="bg-white rounded-2xl border border-[#E8ECF0] shadow-sm p-6">
              {tab === 'upload' && <Upload onUploaded={handleUploaded} />}
              {tab === 'view'   && <View refresh={refreshKey} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EHR
