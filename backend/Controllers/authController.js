import supabase from '../lib/supabase.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '15d' }
  )
}

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body
  try {
    const table = role === 'doctor' ? 'doctors' : 'users'

    // Check if user already exists
    const { data: existing } = await supabase
      .from(table)
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const { data, error } = await supabase
      .from(table)
      .insert({ email, password: hashPassword, name, photo, gender, role })
      .select()
      .single()

    if (error) throw error

    res.status(200).json({ success: true, message: 'User successfully created' })
  } catch (e) {
    res.status(500).json({ success: false, message: `${e.message} Internal server error, try again` })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    let user = null
    let role = null

    // Check users table first
    const { data: patient } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    // Check doctors table
    const { data: doctor } = await supabase
      .from('doctors')
      .select('*')
      .eq('email', email)
      .single()

    if (patient) { user = patient; role = patient.role }
    if (doctor) { user = doctor; role = doctor.role }

    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return res.status(400).json({ status: false, message: 'Invalid credentials' })
    }

    const token = generateToken(user)
    const { password: _pw, ...rest } = user

    return res.status(200).json({
      status: true,
      message: 'Successful Login',
      token,
      data: { ...rest },
      role
    })
  } catch (error) {
    console.log("LOGIN ERROR:", error)
    res.status(500).json({ status: false, message: "Failed to Login" })
  }
}
