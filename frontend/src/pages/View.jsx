import { useState, useEffect } from 'react'
import { BASE_URL } from '../config'
import { toast } from 'react-toastify'
import { MdOutlineDeleteOutline } from 'react-icons/md'
import {
  BsFileMedical, BsCalendarCheck, BsChevronDown, BsChevronUp,
  BsPeopleFill, BsHospital, BsCapsule, BsThermometer, BsClipboardPulse
} from 'react-icons/bs'

/* ── Data row inside the expanded panel ── */
const DataRow = ({ label, value, icon }) => {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[#F1F5F9] last:border-0">
      <div className="w-7 h-7 rounded-lg bg-[#EBF5FF] flex items-center justify-center flex-shrink-0 text-primaryColor text-[13px]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-[700] text-textColor uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-headingColor font-[600] text-[14px] leading-5">{value}</p>
      </div>
    </div>
  )
}

/* ── Pill list (medicines / symptoms) ── */
const PillList = ({ label, items, color }) => {
  if (!items?.length) return null
  const c = {
    blue:   { pill: 'bg-[#EBF5FF] border-[#c0d9ff] text-primaryColor', icon: '💊' },
    yellow: { pill: 'bg-yellow-50 border-yellow-200 text-yellow-700',   icon: '⚠️' },
    green:  { pill: 'bg-green-50 border-green-200 text-green-700',       icon: '✅' },
  }[color] || { pill: 'bg-gray-100 border-gray-200 text-gray-700', icon: '•' }

  return (
    <div className="py-2.5 border-b border-[#F1F5F9] last:border-0">
      <p className="text-[10px] font-[700] text-textColor uppercase tracking-widest mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((v, i) => (
          <span key={i} className={`${c.pill} border text-[12px] font-[600] px-3 py-1 rounded-full`}>
            {c.icon} {v}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Single EHR record card ── */
const EHRCard = ({ item, onDelete }) => {
  const [open, setOpen] = useState(false)

  const ai   = item.ai_summary   // parsed object (or null)
  const ext  = item.filename?.split('.').pop()?.toLowerCase()
  const icon = { pdf: '📄', doc: '📝', docx: '📝', jpg: '🖼️', jpeg: '🖼️', png: '🖼️' }[ext] || '📎'
  const date = item.created_at
    ? new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  return (
    <div className="bg-white border border-[#E8ECF0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 p-4">
        <div className="w-11 h-11 rounded-xl bg-[#EBF5FF] flex items-center justify-center text-[22px] flex-shrink-0">
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-headingColor font-[700] text-[15px] truncate">{item.description}</h4>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <BsCalendarCheck className="text-textColor text-[11px]" />
            <span className="text-textColor text-[12px]">{date}</span>
            <span className="text-gray-300">·</span>
            <span className="text-textColor text-[12px] truncate max-w-[180px]">{item.filename}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {ai && (
            <span className="bg-green-100 text-green-700 text-[10px] font-[700] px-2 py-0.5 rounded-full whitespace-nowrap">
              AI ✓
            </span>
          )}

          {/* Delete */}
          <button
            onClick={() => onDelete(item.id)}
            className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <MdOutlineDeleteOutline size={18} />
          </button>

          {/* View Data toggle — always visible */}
          <button
            onClick={() => setOpen(v => !v)}
            className={`flex items-center gap-1.5 px-3 h-9 rounded-lg text-[12px] font-semibold transition-colors
              ${open
                ? 'bg-primaryColor text-white'
                : 'bg-[#EBF5FF] text-primaryColor hover:bg-primaryColor hover:text-white'}`}
          >
            {open ? <BsChevronUp size={12} /> : <BsChevronDown size={12} />}
            {open ? 'Hide' : 'View Data'}
          </button>
        </div>
      </div>

      {/* ── Expanded: structured data panel ── */}
      {open && (
        <div className="border-t border-[#E8ECF0] bg-[#FAFCFF] p-5">

          {ai ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <BsFileMedical className="text-primaryColor text-[16px]" />
                <h5 className="text-headingColor font-[700] text-[15px]">EHR — Extracted Health Data</h5>
              </div>

              {/* Diagnosis highlight */}
              {ai.diagnosis && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                  <p className="text-[10px] font-[700] text-red-400 uppercase tracking-widest">Diagnosis</p>
                  <p className="text-headingColor font-[700] text-[16px] mt-1">{ai.diagnosis}</p>
                </div>
              )}

              {/* Structured rows */}
              <div className="bg-white rounded-xl border border-[#E8ECF0] px-4 mb-4">
                <DataRow label="Patient Name" value={ai.patient_name} icon={<BsPeopleFill />} />
                <DataRow label="Age"          value={ai.age}          icon="🎂" />
                <DataRow label="Doctor"       value={ai.doctor_name}  icon={<BsHospital />} />
                <DataRow label="Follow-up"    value={ai.follow_up}    icon={<BsClipboardPulse />} />
              </div>

              {/* Medicines + Symptoms side by side */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {ai.medicines?.length > 0 && (
                  <div className="bg-white rounded-xl border border-[#E8ECF0] px-4 py-3">
                    <p className="text-[10px] font-[700] text-textColor uppercase tracking-widest mb-2">Prescribed Medicines</p>
                    <div className="flex flex-wrap gap-2">
                      {ai.medicines.map((m, i) => (
                        <span key={i} className="bg-[#EBF5FF] border border-[#c0d9ff] text-primaryColor text-[12px] font-[600] px-3 py-1 rounded-full">
                          💊 {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {ai.symptoms?.length > 0 && (
                  <div className="bg-white rounded-xl border border-[#E8ECF0] px-4 py-3">
                    <p className="text-[10px] font-[700] text-textColor uppercase tracking-widest mb-2">Symptoms</p>
                    <div className="flex flex-wrap gap-2">
                      {ai.symptoms.map((s, i) => (
                        <span key={i} className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-[12px] font-[600] px-3 py-1 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lab values */}
              {ai.lab_values && Object.keys(ai.lab_values).length > 0 && (
                <div className="bg-white rounded-xl border border-[#E8ECF0] px-4 py-3 mb-4">
                  <p className="text-[10px] font-[700] text-textColor uppercase tracking-widest mb-2">Lab Results</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(ai.lab_values).map(([k, v]) => (
                      <div key={k} className="bg-[#F8FBFF] rounded-lg px-3 py-2">
                        <p className="text-[10px] text-textColor capitalize">{k}</p>
                        <p className="text-headingColor font-[700] text-[13px]">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Summary */}
              {ai.summary && (
                <div className="bg-gradient-to-r from-[#F0FAFB] to-[#EBF5FF] rounded-xl px-4 py-3 border border-[#CCF0F3]">
                  <p className="text-[10px] font-[700] text-irisBlueColor uppercase tracking-widest mb-1">🤖 AI Summary</p>
                  <p className="text-textColor text-[13px] leading-6">{ai.summary}</p>
                </div>
              )}
            </>
          ) : (
            /* No AI data yet */
            <div className="text-center py-8">
              <BsFileMedical className="text-[40px] text-gray-200 mx-auto mb-3" />
              <p className="text-headingColor font-[600] text-[15px]">No extracted data available</p>
              <p className="text-textColor text-[13px] mt-1 max-w-[300px] mx-auto">
                This document was uploaded before AI analysis was enabled.
                Delete and re-upload to get full health data extraction.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Records list ── */
const View = ({ refresh }) => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${BASE_URL}/upload/file`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await res.json()
      setRecords(data.data || [])
    } catch {
      toast.error('Failed to load records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRecords() }, [refresh])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return
    try {
      const res = await fetch(`${BASE_URL}/upload/file`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileid: id })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Document deleted')
        setRecords(prev => prev.filter(r => r.id !== id))
      } else throw new Error(data.message)
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-8 h-8 border-4 border-primaryColor border-t-transparent rounded-full animate-spin" />
      <p className="text-textColor mt-3 text-[14px]">Loading your records...</p>
    </div>
  )

  if (records.length === 0) return (
    <div className="text-center py-12">
      <BsFileMedical className="text-[48px] text-gray-200 mx-auto mb-3" />
      <p className="text-headingColor font-semibold text-[16px]">No documents yet</p>
      <p className="text-textColor text-[13px] mt-1">Upload your first medical record to get started.</p>
    </div>
  )

  return (
    <div className="space-y-3">
      <p className="text-textColor text-[13px] font-medium mb-4">
        {records.length} document{records.length !== 1 ? 's' : ''} found
      </p>
      {records.map((item, i) => (
        <EHRCard key={item.id || i} item={item} onDelete={handleDelete} />
      ))}
    </div>
  )
}

export default View
