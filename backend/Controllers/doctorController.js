import supabase from '../lib/supabase.js'

export const updateDoctor = async (req, res) => {
  const id = req.params.id
  try {
    // Handle nested qualifications and experiences separately
    const { qualifications, experiences, ...doctorFields } = req.body

    const { data: doctor, error } = await supabase
      .from('doctors')
      .update(doctorFields)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Replace qualifications if provided
    if (qualifications !== undefined) {
      await supabase.from('doctor_qualifications').delete().eq('doctor_id', id)
      if (qualifications.length > 0) {
        const rows = qualifications.map(q => ({ ...q, doctor_id: id }))
        await supabase.from('doctor_qualifications').insert(rows)
      }
    }

    // Replace experiences if provided
    if (experiences !== undefined) {
      await supabase.from('doctor_experiences').delete().eq('doctor_id', id)
      if (experiences.length > 0) {
        const rows = experiences.map(e => ({ ...e, doctor_id: id }))
        await supabase.from('doctor_experiences').insert(rows)
      }
    }

    res.status(200).json({ success: true, message: 'Successfully updated', data: doctor })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const deleteDoctor = async (req, res) => {
  const id = req.params.id
  try {
    const { error } = await supabase.from('doctors').delete().eq('id', id)
    if (error) throw error
    res.status(200).json({ success: true, message: 'Successfully deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete' })
  }
}

export const getTopDoctors = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('id, name, specialization, photo, average_rating, total_rating, ticket_price, is_approved')
      .gt('average_rating', 0)
      .order('average_rating', { ascending: false })
      .limit(3)

    if (error) throw error
    res.status(200).json({ success: true, data })
  } catch (e) {
    res.status(401).json({ success: false, message: e.message })
  }
}

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id
  try {
    const { data: doctor, error } = await supabase
      .from('doctors')
      .select(`
        id, email, name, phone, photo, ticket_price, role, specialization,
        bio, about, time_slots, average_rating, total_rating, is_approved,
        doctor_qualifications ( id, time, degree, institute ),
        doctor_experiences ( id, place, post, duration ),
        reviews ( id, review_text, rating, created_at, users ( id, name, photo ) )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    res.status(200).json({ success: true, message: 'Doctor found', data: doctor })
  } catch (err) {
    res.status(500).json({ success: false, message: 'No doctor found' })
  }
}

export const getAllDoctors = async (req, res) => {
  try {
    const { query } = req.query
    let queryBuilder = supabase
      .from('doctors')
      .select('id, email, name, phone, photo, ticket_price, role, specialization, bio, average_rating, total_rating, is_approved')

    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,specialization.ilike.%${query}%`)
        .eq('is_approved', 'approved')
    }

    const { data, error } = await queryBuilder
    if (error) throw error

    res.status(200).json({ success: true, message: 'Doctors found', data })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Not found' })
  }
}

export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId
  try {
    const { data: doctor, error } = await supabase
      .from('doctors')
      .select(`
        id, email, name, phone, photo, ticket_price, role, specialization,
        bio, about, time_slots, average_rating, total_rating, is_approved,
        doctor_qualifications ( id, time, degree, institute ),
        doctor_experiences ( id, place, post, duration )
      `)
      .eq('id', doctorId)
      .single()

    if (error || !doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' })
    }

    const { data: appointments } = await supabase
      .from('bookings')
      .select('id, ticket_price, appointment_date, status, is_paid, users ( id, name, photo )')
      .eq('doctor_id', doctorId)

    res.status(200).json({
      success: true,
      message: 'Profile info is getting',
      data: { ...doctor, appointments }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}
