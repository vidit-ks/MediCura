import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { BASE_URL } from '../../config'
import { BsCalendarCheck, BsStar, BsPeopleFill, BsClockHistory } from 'react-icons/bs'

/* ── Status badge colours ── */
const STATUS_STYLE = {
  pending:   { bg: '#FFF7ED', color: '#C2410C', label: 'Pending'   },
  approved:  { bg: '#F0FDF4', color: '#15803D', label: 'Approved'  },
  cancelled: { bg: '#FFF1F2', color: '#BE123C', label: 'Cancelled' },
}

const Dashboard = () => {
  const { state, dispatch } = useContext(AuthContext)
  const { user, token } = state

  const [doctorData, setDoctorData]   = useState({})
  const [bookings,   setBookings]     = useState([])
  const [tab,        setTab]          = useState('bookings')
  const [loading,    setLoading]      = useState(true)
  const [statusLoading, setStatusLoading] = useState(null)  // bookingId being updated

  const doctorId = user?.id || user?._id

  /* ── Fetch doctor profile ── */
  useEffect(() => {
    if (!token) return
    const fetchProfile = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/doctors/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setDoctorData(data.data || {})
      } catch (e) { console.error(e) }
    }
    fetchProfile()
  }, [token])

  /* ── Fetch bookings ── */
  useEffect(() => {
    if (!token) return
    const fetchBookings = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/doctors/my-bookings`, { headers: { Authorization: `Bearer ${token}` } })
        const data = await res.json()
        setBookings(data.data || [])
      } catch (e) { console.error(e) }
      finally    { setLoading(false) }
    }
    fetchBookings()
  }, [token])

  const handleLogout = () => dispatch({ type: 'LOGOUT' })

  /* ── Update booking status ── */
  const handleStatusChange = async (bookingId, newStatus) => {
    setStatusLoading(bookingId)
    try {
      const res = await fetch(`${BASE_URL}/doctors/${doctorId}/booking/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
      }
    } catch (e) { console.error(e) }
    finally { setStatusLoading(null) }
  }

  const displayRating  = doctorData.average_rating ?? 0
  const timeSlots      = doctorData.time_slots ?? []
  const pendingCount   = bookings.filter(b => b.status === 'pending').length
  const approvedCount  = bookings.filter(b => b.status === 'approved').length

  if (loading) {
    return (
      <section>
        <div className="max-w-[1170px] px-5 mx-auto text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-primaryColor border-t-transparent rounded-full animate-spin" />
          <p className="text-textColor mt-4">Loading dashboard...</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        <div className="grid md:grid-cols-3 gap-10">

          {/* ── Sidebar ── */}
          <div className="pb-[50px] px-[30px] rounded-md">
            <div className="flex items-center justify-center">
              <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor overflow-hidden">
                <img src={doctorData.photo || user?.photo || 'https://via.placeholder.com/100'} alt="avatar" className="w-full h-full object-cover" />
              </figure>
            </div>
            <div className="text-center mt-4">
              <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">{doctorData.name || user?.name}</h3>
              <p className="text-textColor text-[13px]">{doctorData.email || user?.email}</p>
              {doctorData.specialization && (
                <span className="mt-2 inline-block bg-[#CCF0F3] text-irisBlueColor text-[12px] font-semibold px-3 py-1 rounded-full">
                  {doctorData.specialization}
                </span>
              )}
              <div className="flex items-center justify-center gap-1 mt-2">
                <BsStar className="text-yellow-400" />
                <span className="text-headingColor font-semibold text-[14px]">{parseFloat(displayRating.toFixed(1))}</span>
                <span className="text-textColor text-[12px]">({doctorData.total_rating ?? 0})</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-5 space-y-2">
              <div className="flex justify-between items-center bg-[#F0FAFB] rounded-lg px-3 py-2">
                <span className="text-textColor text-[13px]">Ticket Price</span>
                <span className="text-headingColor font-bold">₹{doctorData.ticket_price ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center bg-[#F0FAFB] rounded-lg px-3 py-2">
                <span className="text-textColor text-[13px]">Total Bookings</span>
                <span className="text-headingColor font-bold">{bookings.length}</span>
              </div>
              <div className="flex justify-between items-center bg-[#F0FAFB] rounded-lg px-3 py-2">
                <span className="text-textColor text-[13px]">Pending</span>
                <span className="font-bold text-orange-500">{pendingCount}</span>
              </div>
            </div>

            <button onClick={handleLogout} className="w-full mt-8 bg-[#181A1E] p-3 text-[15px] rounded-md text-white hover:opacity-90 transition-opacity">
              Logout
            </button>
          </div>

          {/* ── Main Content ── */}
          <div className="md:col-span-2 md:px-[30px]">

            {/* Tabs */}
            <div className="flex gap-3 mb-6 flex-wrap">
              {[
                { key: 'bookings', label: `Bookings (${bookings.length})` },
                { key: 'overview', label: 'Overview' },
                { key: 'timeslots', label: 'Time Slots' },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`px-5 py-2 rounded-md text-[14px] font-semibold border border-solid border-primaryColor transition-colors
                    ${tab === t.key ? 'bg-primaryColor text-white' : 'text-headingColor hover:bg-primaryColor hover:text-white'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── BOOKINGS TAB ── */}
            {tab === 'bookings' && (
              <div>
                {bookings.length === 0 ? (
                  <div className="text-center py-16">
                    <BsCalendarCheck className="text-[48px] text-gray-300 mx-auto mb-3" />
                    <p className="text-textColor text-[15px]">No bookings yet.</p>
                    <p className="text-gray-400 text-[13px] mt-1">Bookings from patients will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(booking => {
                      const patient = booking.users || {}
                      const st = STATUS_STYLE[booking.status] || STATUS_STYLE.pending
                      const [day, ...timeParts] = (booking.appointment_date || '').split(' ')
                      const timeRange = timeParts.join(' ')

                      return (
                        <div key={booking.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Patient avatar */}
                          <div className="w-[52px] h-[52px] rounded-full overflow-hidden flex-shrink-0 border-2 border-[#CCF0F3]">
                            {patient.photo
                              ? <img src={patient.photo} className="w-full h-full object-cover" alt={patient.name} />
                              : <div className="w-full h-full bg-primaryColor flex items-center justify-center text-white font-bold text-[16px]">
                                  {patient.name?.charAt(0)?.toUpperCase() || 'P'}
                                </div>
                            }
                          </div>

                          {/* Patient info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-headingColor font-[700] text-[15px] truncate">{patient.name || 'Patient'}</p>
                            <p className="text-textColor text-[12px] truncate">{patient.email}</p>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="flex items-center gap-1 text-[12px] text-textColor">
                                <BsCalendarCheck className="text-irisBlueColor" /> {day}
                              </span>
                              {timeRange && (
                                <span className="flex items-center gap-1 text-[12px] text-textColor">
                                  <BsClockHistory className="text-irisBlueColor" /> {timeRange}
                                </span>
                              )}
                              <span className="text-[12px] text-headingColor font-semibold">₹{booking.ticket_price}</span>
                            </div>
                          </div>

                          {/* Status + actions */}
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <span style={{ background: st.bg, color: st.color }} className="text-[11px] font-[700] px-3 py-1 rounded-full capitalize">
                              {st.label}
                            </span>
                            {booking.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  disabled={statusLoading === booking.id}
                                  onClick={() => handleStatusChange(booking.id, 'approved')}
                                  className="text-[12px] font-[600] bg-green-50 text-green-700 border border-green-300 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                >
                                  Approve
                                </button>
                                <button
                                  disabled={statusLoading === booking.id}
                                  onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                  className="text-[12px] font-[600] bg-red-50 text-red-600 border border-red-300 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── OVERVIEW TAB ── */}
            {tab === 'overview' && (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <StatCard icon={<BsCalendarCheck />} label="Total Bookings" value={bookings.length} color="#01B5C5" />
                  <StatCard icon={<BsPeopleFill />}    label="Approved"       value={approvedCount}   color="#15803D" />
                  <StatCard icon={<BsClockHistory />}  label="Pending"        value={pendingCount}    color="#C2410C" />
                  <StatCard icon={<BsStar />}          label="Avg Rating"     value={parseFloat(displayRating.toFixed(1))} color="#F59E0B" />
                </div>
                {doctorData.about && (
                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <h4 className="text-headingColor font-bold text-[15px] mb-2">About</h4>
                    <p className="text-textColor text-[14px] leading-6">{doctorData.about}</p>
                  </div>
                )}
                {doctorData.doctor_qualifications?.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mt-4">
                    <h4 className="text-headingColor font-bold text-[15px] mb-3">Qualifications</h4>
                    <ul className="space-y-2">
                      {doctorData.doctor_qualifications.map((q, i) => (
                        <li key={q.id||i} className="flex gap-3 text-[13px]">
                          <span className="text-irisBlueColor font-semibold whitespace-nowrap">{q.starting_date?.slice(0,4)}–{q.ending_date?.slice(0,4)}</span>
                          <span className="text-textColor">{q.degree}, {q.university}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {doctorData.doctor_experiences?.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mt-4">
                    <h4 className="text-headingColor font-bold text-[15px] mb-3">Experience</h4>
                    <ul className="space-y-2">
                      {doctorData.doctor_experiences.map((e, i) => (
                        <li key={e.id||i} className="flex gap-3 text-[13px]">
                          <span className="text-irisBlueColor font-semibold whitespace-nowrap">{e.starting_date?.slice(0,4)}–{e.ending_date?.slice(0,4)}</span>
                          <span className="text-textColor">{e.position}, {e.hospital}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* ── TIME SLOTS TAB ── */}
            {tab === 'timeslots' && (
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h4 className="text-headingColor font-bold text-[15px] mb-4">Available Time Slots</h4>
                {timeSlots.length === 0 ? (
                  <p className="text-textColor text-[14px]">No time slots configured.</p>
                ) : (
                  <ul className="space-y-2">
                    {timeSlots.map((slot, i) => (
                      <li key={i} className="flex items-center gap-3 bg-[#F0FAFB] rounded-lg px-4 py-2">
                        <span className="w-2 h-2 rounded-full bg-irisBlueColor flex-shrink-0" />
                        <span className="text-textColor text-[14px] font-medium">{slot}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Small stat card ── */
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-[#F0FAFB] rounded-xl p-4 flex items-center gap-3">
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: color + '22', color }}>
      {icon}
    </div>
    <div>
      <p className="text-textColor text-[12px]">{label}</p>
      <h3 className="text-headingColor text-[20px] font-bold leading-tight">{value}</h3>
    </div>
  </div>
)

export default Dashboard