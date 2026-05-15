import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import authRoute from './Routes/auth.js'
import userRoute from './Routes/user.js'
import aiRoute from './Routes/aiModel.js'
import uploadRoute from './Routes/upload.js'
import doctorRoute from './Routes/doctor.js'
import reviewRoute from './Routes/review.js'
import supabase from './lib/supabase.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 5000

const corsOptions = {
  origin: true
}

app.get('/', (req, res) => {
  res.send('Api is working')
})

// Verify Supabase connection on startup
const verifySupabase = async () => {
  try {
    const { error } = await supabase.from('users').select('count').limit(1)
    if (error) throw error
    console.log("✅ Connected to Supabase successfully")
  } catch (err) {
    console.error("❌ Supabase connection error:", err.message)
  }
}

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/ai', aiRoute)
app.use('/api/v1/upload', uploadRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/doctors', doctorRoute)
app.use('/api/v1/reviews', reviewRoute)

app.listen(port, () => {
  verifySupabase()
  console.log(`Server is running on port = ${port}`)
})