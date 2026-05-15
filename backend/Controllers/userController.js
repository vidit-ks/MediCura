import supabase from '../lib/supabase.js'
import bcrypt from 'bcryptjs'

export const updateUser = async (req, res) => {
  const id = req.params.id
  try {
    // Build a clean payload with only columns that exist in the users table
    const allowed = ['name', 'email', 'photo', 'gender', 'blood_type', 'phone']
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined && req.body[key] !== '') {
        updates[key] = req.body[key]
      }
    }
    // Hash password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      updates.password = await bcrypt.hash(req.body.password, salt)
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select('id, name, email, photo, gender, blood_type, role')
      .single()

    if (error) throw error
    res.status(200).json({ success: true, message: 'Successfully updated', data })
  } catch (err) {
    res.status(500).json({ success: false, message: `Failed to update: ${err.message}` })
  }
}

export const deleteUser = async (req, res) => {
  const id = req.params.id
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw error
    res.status(200).json({ success: true, message: 'Successfully deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete' })
  }
}

export const getSingleUser = async (req, res) => {
  const id = req.params.id
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, phone, photo, role, gender, blood_type, created_at')
      .eq('id', id)
      .single()

    if (error) throw error
    res.status(200).json({ success: true, message: 'User found', data })
  } catch (err) {
    res.status(500).json({ success: false, message: 'No user found' })
  }
}

export const getAllUser = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, phone, photo, role, gender, blood_type, created_at')

    if (error) throw error
    res.status(200).json({ success: true, message: 'Users found', data })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Not found' })
  }
}

export const getUserProfile = async (req, res) => {
  const userId = req.userId
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, phone, photo, role, gender, blood_type, created_at')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({ success: true, message: 'Profile info is getting', data })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}

export const getMyAppointments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, ticket_price, appointment_date, status, is_paid, created_at,
        doctors ( id, name, specialization, photo )
      `)
      .eq('user_id', req.userId)

    if (error) throw error
    res.status(200).json({ success: true, message: 'Appointments are getting', data })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}