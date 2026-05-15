import supabase from '../lib/supabase.js'

export const scheduleBooking = async (req, res, next) => {
  const doctorId = req.body.doctor || req.params.doctorId
  const userId = req.userId
  const { ticketPrice, appointmentDate } = req.body

  try {
    // Check for existing booking at same date
    const { data: existing } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', userId)
      .eq('appointment_date', appointmentDate)
      .single()

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You already have a booking at this time',
        data: existing
      })
    }

    // Create booking
    const { data: savedBooking, error } = await supabase
      .from('bookings')
      .insert({
        doctor_id: doctorId,
        user_id: userId,
        ticket_price: ticketPrice || req.body.ticketPrice,
        appointment_date: appointmentDate,
        status: 'pending',
        is_paid: req.body.isPaid !== undefined ? req.body.isPaid : true
      })
      .select()
      .single()

    if (error) throw error

    res.status(200).json({ success: true, message: 'Booking Scheduled', data: savedBooking })
  } catch (e) {
    console.log(e)
    res.status(500).json({ success: false, message: 'Failed to schedule booking' })
  }
}

export const changeStatus = async (req, res, next) => {
  try {
    const docId = req.userId
    const bookingId = req.params.bookingId
    const newStatus = req.body.status

    // Verify booking belongs to this doctor
    const { data: booking, error: findError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('doctor_id', docId)
      .single()

    if (findError || !booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    const { data: updated, error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error

    return res.status(200).json({ message: 'Booking status updated successfully', booking: updated })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getDoctorBookings = async (req, res) => {
  try {
    const doctorId = req.userId  // set by authenticate middleware

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, ticket_price, appointment_date, status, is_paid, created_at,
        users ( id, name, email, photo, gender, blood_type )
      `)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.status(200).json({ success: true, message: 'Bookings fetched', data })
  } catch (e) {
    console.log(e)
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' })
  }
}
