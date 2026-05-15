import { BASE_URL } from '../../config'
import { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { BsCheckCircleFill, BsCalendarCheck, BsClock } from 'react-icons/bs'

const SidePanel = ({ doctors }) => {
  const { ticket_price, ticketPrice, timeSlots, time_slots, id, _id, name } = doctors
  const finalTicketPrice = ticket_price ?? ticketPrice
  const finalTimeSlots = time_slots ?? timeSlots ?? []
  const doctorId = id || _id

  const { state } = useContext(AuthContext)
  const { token } = state
  const navigate = useNavigate()

  const [selectedCheckbox, setSelectedCheckbox] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(null) // holds booked slot on success

  function extractDayAndTime(inputString) {
    try {
      const index = inputString.indexOf(' ')
      return {
        day: inputString.slice(0, index),
        timeRange: inputString.slice(index + 1)
      }
    } catch {
      return { day: inputString, timeRange: '' }
    }
  }

  const handleBookAppointment = async () => {
    if (!token) {
      toast.info('Please login first to book an appointment')
      navigate('/login')
      return
    }
    if (selectedCheckbox === null) {
      toast.warning('Please select a time slot first')
      return
    }

    const timeSlot = finalTimeSlots[selectedCheckbox]
    setLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/doctors/${doctorId}/booking`, {
        method: 'POST',
        body: JSON.stringify({
          ticketPrice: finalTicketPrice,
          appointmentDate: timeSlot,
          status: 'pending',
          isPaid: true
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed')
      }

      setConfirmed(timeSlot)
      toast.success('Appointment booked successfully!')
    } catch (e) {
      toast.error(e.message || 'Failed to book appointment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Confirmation screen ── */
  if (confirmed) {
    const { day, timeRange } = extractDayAndTime(confirmed)
    return (
      <div className="shadow-xl p-5 rounded-md">
        {/* Success icon */}
        <div className="flex flex-col items-center text-center py-4">
          <BsCheckCircleFill className="text-green-500 text-[56px] mb-4" />
          <h3 className="text-headingColor font-[700] text-[20px] leading-8">
            Appointment Confirmed!
          </h3>
          <p className="text-textColor text-[14px] mt-1">
            Your appointment with <span className="font-semibold text-headingColor">{name}</span> has been booked.
          </p>
        </div>

        {/* Booking details card */}
        <div className="bg-[#F0FAFB] rounded-xl p-4 mt-2 space-y-3">
          <div className="flex items-center gap-3">
            <BsCalendarCheck className="text-irisBlueColor text-[18px] flex-shrink-0" />
            <div>
              <p className="text-[11px] text-textColor font-medium uppercase tracking-wide">Day</p>
              <p className="text-headingColor font-[600] text-[15px]">{day}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BsClock className="text-irisBlueColor text-[18px] flex-shrink-0" />
            <div>
              <p className="text-[11px] text-textColor font-medium uppercase tracking-wide">Time</p>
              <p className="text-headingColor font-[600] text-[15px]">{timeRange}</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#CCF0F3]">
            <span className="text-textColor text-[13px] font-medium">Ticket Price</span>
            <span className="text-headingColor font-[700] text-[16px]">₹{finalTicketPrice}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-textColor text-[13px] font-medium">Status</span>
            <span className="bg-yellow-100 text-yellow-700 text-[11px] font-[700] px-3 py-1 rounded-full capitalize">
              Pending
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 space-y-2">
          <button
            onClick={() => navigate('/users/profile/me')}
            className="w-full bg-primaryColor text-white py-3 rounded-lg font-[600] text-[15px] hover:opacity-90 transition-opacity"
          >
            View My Bookings
          </button>
          <button
            onClick={() => setConfirmed(null)}
            className="w-full border border-solid border-primaryColor text-primaryColor py-3 rounded-lg font-[600] text-[15px] hover:bg-[#f0f6ff] transition-colors"
          >
            Book Another Slot
          </button>
        </div>
      </div>
    )
  }

  /* ── Default: slot selection ── */
  return (
    <div className="shadow-xl p-3 lg:p-5 rounded-md">
      {/* Price */}
      <div className="flex items-center justify-between">
        <p className="text_para mt-0 font-semibold">Ticket Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          ₹{finalTicketPrice}
        </span>
      </div>

      {/* Time slots */}
      <div className="mt-[30px]">
        <p className="text_para mt-0 font-semibold text-headingColor">Available Time Slots:</p>
        {finalTimeSlots.length === 0 ? (
          <p className="text-textColor text-[14px] mt-3">No slots available.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {finalTimeSlots.map((timeSlot, index) => {
              const { day, timeRange } = extractDayAndTime(timeSlot)
              const isSelected = selectedCheckbox === index
              return (
                <li
                  key={index}
                  onClick={() => setSelectedCheckbox(prev => prev === index ? null : index)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer border transition-all
                    ${isSelected
                      ? 'border-primaryColor bg-[#EBF5FF]'
                      : 'border-gray-200 hover:border-primaryColor hover:bg-[#f8fbff]'
                    }`}
                >
                  <p className="text-[14px] text-textColor font-semibold">{day}</p>
                  <p className="text-[14px] text-textColor font-semibold">{timeRange}</p>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${isSelected ? 'border-primaryColor bg-primaryColor' : 'border-gray-300'}`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Book button */}
      <button
        className="btn px-2 w-full rounded-md mt-5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        onClick={handleBookAppointment}
        disabled={loading}
        style={{ lineHeight: 'normal' }}
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Booking...
          </>
        ) : 'Book Appointment'}
      </button>
    </div>
  )
}

export default SidePanel
