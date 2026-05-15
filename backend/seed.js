import supabase from './lib/supabase.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

const doctors = [
  {
    name: "Dr. Alpesh Mehta",
    email: "alpesh.mehta@cura.com",
    password: "Doctor@123",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    specialization: "Surgeon",
    bio: "Expert surgeon with 15+ years of experience.",
    about: "Dr. Alpesh Mehta is a renowned surgeon specializing in minimally invasive procedures with over 15 years of clinical experience.",
    ticket_price: 500,
    role: "doctor",
    is_approved: "approved",
    average_rating: 4.8,
    total_rating: 23,
    time_slots: ["Sunday 10:00-11:00", "Monday 14:00-15:00", "Wednesday 10:00-11:00"]
  },
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@cura.com",
    password: "Doctor@123",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
    specialization: "Neurologist",
    bio: "Leading neurologist focused on brain and spine disorders.",
    about: "Dr. Priya Sharma is a distinguished neurologist with expertise in treating complex neurological conditions including stroke, epilepsy, and Parkinson's disease.",
    ticket_price: 700,
    role: "doctor",
    is_approved: "approved",
    average_rating: 4.9,
    total_rating: 31,
    time_slots: ["Tuesday 09:00-10:00", "Thursday 14:00-15:00", "Saturday 11:00-12:00"]
  },
  {
    name: "Dr. Rahul Verma",
    email: "rahul.verma@cura.com",
    password: "Doctor@123",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    specialization: "Cardiologist",
    bio: "Cardiologist with expertise in heart disease prevention.",
    about: "Dr. Rahul Verma is a highly skilled cardiologist dedicated to heart health. He specializes in preventive cardiology, echocardiography, and interventional procedures.",
    ticket_price: 800,
    role: "doctor",
    is_approved: "approved",
    average_rating: 4.7,
    total_rating: 18,
    time_slots: ["Monday 10:00-11:00", "Wednesday 15:00-16:00", "Friday 09:00-10:00"]
  },
  {
    name: "Dr. Sunita Patel",
    email: "sunita.patel@cura.com",
    password: "Doctor@123",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    specialization: "Pediatrician",
    bio: "Caring pediatrician dedicated to children's health.",
    about: "Dr. Sunita Patel has devoted her career to pediatric medicine, providing compassionate care for children from newborns to adolescents.",
    ticket_price: 400,
    role: "doctor",
    is_approved: "approved",
    average_rating: 4.6,
    total_rating: 27,
    time_slots: ["Monday 09:00-10:00", "Tuesday 14:00-15:00", "Thursday 10:00-11:00"]
  },
  {
    name: "Dr. Arjun Kapoor",
    email: "arjun.kapoor@cura.com",
    password: "Doctor@123",
    photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80",
    specialization: "Dermatologist",
    bio: "Expert in skin, hair and nail conditions.",
    about: "Dr. Arjun Kapoor is a board-certified dermatologist specializing in medical, surgical, and cosmetic dermatology with a focus on evidence-based treatments.",
    ticket_price: 450,
    role: "doctor",
    is_approved: "approved",
    average_rating: 4.5,
    total_rating: 15,
    time_slots: ["Wednesday 11:00-12:00", "Friday 14:00-15:00", "Saturday 09:00-10:00"]
  },
  {
    name: "Dr. Meena Joshi",
    email: "meena.joshi@cura.com",
    password: "Doctor@123",
    photo: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&q=80",
    specialization: "Orthopedic",
    bio: "Specialist in bone, joint and muscle treatments.",
    about: "Dr. Meena Joshi is an orthopedic specialist renowned for her expertise in joint replacement surgery and sports medicine.",
    ticket_price: 600,
    role: "doctor",
    is_approved: "approved",
    average_rating: 4.8,
    total_rating: 20,
    time_slots: ["Tuesday 10:00-11:00", "Thursday 15:00-16:00", "Saturday 14:00-15:00"]
  }
]

const qualifications = {
  "alpesh.mehta@cura.com": [
    { time: "2005 - 2011", degree: "MBBS", institute: "AIIMS Delhi" },
    { time: "2011 - 2014", degree: "MS General Surgery", institute: "PGI Chandigarh" }
  ],
  "priya.sharma@cura.com": [
    { time: "2003 - 2009", degree: "MBBS", institute: "Mumbai Medical College" },
    { time: "2009 - 2013", degree: "MD Neurology", institute: "NIMHANS Bangalore" }
  ],
  "rahul.verma@cura.com": [
    { time: "2004 - 2010", degree: "MBBS", institute: "KEM Hospital Mumbai" },
    { time: "2010 - 2014", degree: "DM Cardiology", institute: "AIIMS Delhi" }
  ],
  "sunita.patel@cura.com": [
    { time: "2006 - 2012", degree: "MBBS", institute: "Ahmedabad Medical College" },
    { time: "2012 - 2015", degree: "MD Pediatrics", institute: "BJ Medical College" }
  ],
  "arjun.kapoor@cura.com": [
    { time: "2007 - 2013", degree: "MBBS", institute: "Maulana Azad Medical College" },
    { time: "2013 - 2016", degree: "MD Dermatology", institute: "AIIMS Delhi" }
  ],
  "meena.joshi@cura.com": [
    { time: "2005 - 2011", degree: "MBBS", institute: "Pune Medical College" },
    { time: "2011 - 2015", degree: "MS Orthopaedics", institute: "SGPGIMS Lucknow" }
  ]
}

const experiences = {
  "alpesh.mehta@cura.com": [
    { place: "Apollo Hospital Delhi", post: "Senior Surgeon", duration: "2014 - 2018" },
    { place: "Fortis Hospital", post: "Chief Surgeon", duration: "2018 - Present" }
  ],
  "priya.sharma@cura.com": [
    { place: "Kokilaben Hospital Mumbai", post: "Consultant Neurologist", duration: "2013 - 2017" },
    { place: "Max Healthcare Delhi", post: "Senior Neurologist", duration: "2017 - Present" }
  ],
  "rahul.verma@cura.com": [
    { place: "Medanta Hospital", post: "Interventional Cardiologist", duration: "2014 - 2019" },
    { place: "Narayana Health", post: "Head of Cardiology", duration: "2019 - Present" }
  ],
  "sunita.patel@cura.com": [
    { place: "Sterling Hospital Ahmedabad", post: "Pediatrician", duration: "2015 - 2019" },
    { place: "Apollo Children's Hospital", post: "Senior Pediatrician", duration: "2019 - Present" }
  ],
  "arjun.kapoor@cura.com": [
    { place: "Skin Clinic New Delhi", post: "Dermatologist", duration: "2016 - 2020" },
    { place: "Fortis Skin Centre", post: "Senior Dermatologist", duration: "2020 - Present" }
  ],
  "meena.joshi@cura.com": [
    { place: "Jehangir Hospital Pune", post: "Orthopaedic Surgeon", duration: "2015 - 2020" },
    { place: "Ruby Hall Clinic", post: "Senior Orthopaedic", duration: "2020 - Present" }
  ]
}

async function seed() {
  console.log('🌱 Starting database seed...\n')

  for (const doc of doctors) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('doctors')
      .select('id, email')
      .eq('email', doc.email)
      .single()

    if (existing) {
      console.log(`⏭️  Skipping ${doc.name} (already exists)`)
      continue
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(doc.password, salt)

    // Insert doctor
    const { data: inserted, error } = await supabase
      .from('doctors')
      .insert({ ...doc, password: hashedPassword })
      .select()
      .single()

    if (error) {
      console.error(`❌ Failed to insert ${doc.name}:`, error.message)
      continue
    }

    console.log(`✅ Inserted doctor: ${inserted.name} (${inserted.id})`)

    // Insert qualifications
    const quals = qualifications[doc.email] || []
    if (quals.length > 0) {
      const qualRows = quals.map(q => ({ ...q, doctor_id: inserted.id }))
      await supabase.from('doctor_qualifications').insert(qualRows)
      console.log(`   📚 Added ${quals.length} qualifications`)
    }

    // Insert experiences
    const exps = experiences[doc.email] || []
    if (exps.length > 0) {
      const expRows = exps.map(e => ({ ...e, doctor_id: inserted.id }))
      await supabase.from('doctor_experiences').insert(expRows)
      console.log(`   💼 Added ${exps.length} experiences`)
    }
  }

  console.log('\n✅ Seed complete! Check your Supabase dashboard.')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
