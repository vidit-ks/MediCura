import supabase from './lib/supabase.js'
import dotenv from 'dotenv'
dotenv.config()

// Match the original MongoDB DiseaseSchema field names
const diseases = [
  { diseasename: 'Fungal infection', basic_remedy: 'Apply antifungal cream, keep area dry', self_curable: 'Yes', doctortype: 'Dermatologist', other_symptoms: 'Itching, redness, skin rash' },
  { diseasename: 'Allergy', basic_remedy: 'Antihistamines, avoid allergens', self_curable: 'Yes', doctortype: 'General Physician', other_symptoms: 'Sneezing, watery eyes, rash' },
  { diseasename: 'GERD', basic_remedy: 'Antacids, avoid spicy food, small meals', self_curable: 'Yes', doctortype: 'Gastroenterologist', other_symptoms: 'Heartburn, regurgitation, chest pain' },
  { diseasename: 'Chronic cholestasis', basic_remedy: 'Bile acid supplements, vitamin supplements', self_curable: 'No', doctortype: 'Gastroenterologist', other_symptoms: 'Jaundice, itching, fatigue' },
  { diseasename: 'Drug Reaction', basic_remedy: 'Stop medication, antihistamines', self_curable: 'Yes', doctortype: 'General Physician', other_symptoms: 'Rash, itching, swelling' },
  { diseasename: 'Peptic ulcer diseae', basic_remedy: 'Antacids, antibiotics for H.pylori', self_curable: 'No', doctortype: 'Gastroenterologist', other_symptoms: 'Burning stomach pain, nausea, bloating' },
  { diseasename: 'AIDS', basic_remedy: 'Antiretroviral therapy (ART)', self_curable: 'No', doctortype: 'Infectious Disease Specialist', other_symptoms: 'Fever, fatigue, weight loss' },
  { diseasename: 'Diabetes', basic_remedy: 'Diet control, exercise, insulin', self_curable: 'No', doctortype: 'Endocrinologist', other_symptoms: 'Frequent urination, thirst, fatigue' },
  { diseasename: 'Gastroenteritis', basic_remedy: 'Oral rehydration, rest, bland diet', self_curable: 'Yes', doctortype: 'Gastroenterologist', other_symptoms: 'Diarrhea, vomiting, stomach cramps' },
  { diseasename: 'Bronchial Asthma', basic_remedy: 'Inhalers, avoid triggers, bronchodilators', self_curable: 'No', doctortype: 'Pulmonologist', other_symptoms: 'Wheezing, cough, shortness of breath' },
  { diseasename: 'Hypertension', basic_remedy: 'Low sodium diet, exercise, antihypertensives', self_curable: 'No', doctortype: 'Cardiologist', other_symptoms: 'Headache, dizziness, chest pain' },
  { diseasename: 'Migraine', basic_remedy: 'Pain relievers, rest in dark quiet room', self_curable: 'Yes', doctortype: 'Neurologist', other_symptoms: 'Severe headache, nausea, light sensitivity' },
  { diseasename: 'Cervical spondylosis', basic_remedy: 'Physiotherapy, pain relievers, neck exercises', self_curable: 'Yes', doctortype: 'Orthopedic', other_symptoms: 'Neck pain, stiffness, numbness in arms' },
  { diseasename: 'Paralysis (brain hemorrhage)', basic_remedy: 'Emergency treatment, rehabilitation therapy', self_curable: 'No', doctortype: 'Neurologist', other_symptoms: 'Sudden weakness, speech problems, confusion' },
  { diseasename: 'Jaundice', basic_remedy: 'Hydration, rest, treat underlying cause', self_curable: 'Yes', doctortype: 'Gastroenterologist', other_symptoms: 'Yellow skin, dark urine, fatigue' },
  { diseasename: 'Malaria', basic_remedy: 'Antimalarial drugs, rest, hydration', self_curable: 'Yes', doctortype: 'Infectious Disease Specialist', other_symptoms: 'Fever, chills, sweating, headache' },
  { diseasename: 'Chicken pox', basic_remedy: 'Antihistamines, calamine lotion, antiviral', self_curable: 'Yes', doctortype: 'General Physician', other_symptoms: 'Itchy blisters, fever, fatigue' },
  { diseasename: 'Dengue', basic_remedy: 'Rest, fluids, pain relievers', self_curable: 'Yes', doctortype: 'General Physician', other_symptoms: 'High fever, rash, joint pain, headache' },
  { diseasename: 'Typhoid', basic_remedy: 'Antibiotics, hydration, rest', self_curable: 'No', doctortype: 'General Physician', other_symptoms: 'Sustained fever, weakness, stomach pain' },
  { diseasename: 'hepatitis A', basic_remedy: 'Rest, hydration, nutritious diet', self_curable: 'Yes', doctortype: 'Gastroenterologist', other_symptoms: 'Fatigue, nausea, jaundice, abdominal pain' },
  { diseasename: 'Hepatitis B', basic_remedy: 'Antiviral medications, vaccination', self_curable: 'No', doctortype: 'Gastroenterologist', other_symptoms: 'Jaundice, fatigue, abdominal pain' },
  { diseasename: 'Hepatitis C', basic_remedy: 'Antiviral therapy, avoid alcohol', self_curable: 'No', doctortype: 'Gastroenterologist', other_symptoms: 'Fatigue, liver pain, jaundice' },
  { diseasename: 'Tuberculosis', basic_remedy: 'Anti-TB drugs for 6 months', self_curable: 'No', doctortype: 'Pulmonologist', other_symptoms: 'Persistent cough, weight loss, night sweats' },
  { diseasename: 'Common Cold', basic_remedy: 'Rest, hydration, over-the-counter cold medicine', self_curable: 'Yes', doctortype: 'General Physician', other_symptoms: 'Runny nose, sore throat, sneezing' },
  { diseasename: 'Pneumonia', basic_remedy: 'Antibiotics, rest, hydration', self_curable: 'No', doctortype: 'Pulmonologist', other_symptoms: 'Cough with phlegm, fever, chest pain' },
  { diseasename: 'Heart attack', basic_remedy: 'Emergency medical care, aspirin', self_curable: 'No', doctortype: 'Cardiologist', other_symptoms: 'Chest pain, shortness of breath, nausea' },
  { diseasename: 'Varicose veins', basic_remedy: 'Compression stockings, exercise', self_curable: 'Yes', doctortype: 'Vascular Surgeon', other_symptoms: 'Swollen veins, aching legs, cramping' },
  { diseasename: 'Hypothyroidism', basic_remedy: 'Thyroid hormone replacement therapy', self_curable: 'No', doctortype: 'Endocrinologist', other_symptoms: 'Fatigue, weight gain, cold intolerance' },
  { diseasename: 'Hyperthyroidism', basic_remedy: 'Antithyroid medications, radioiodine therapy', self_curable: 'No', doctortype: 'Endocrinologist', other_symptoms: 'Weight loss, rapid heartbeat, anxiety' },
  { diseasename: 'Osteoarthritis', basic_remedy: 'Exercise, pain relievers, physical therapy', self_curable: 'Yes', doctortype: 'Orthopedic', other_symptoms: 'Joint pain, stiffness, swelling' },
  { diseasename: 'Arthritis', basic_remedy: 'Anti-inflammatory drugs, physiotherapy', self_curable: 'No', doctortype: 'Orthopedic', other_symptoms: 'Joint pain, swelling, stiffness' },
  { diseasename: 'Urinary tract infection', basic_remedy: 'Antibiotics, increased fluid intake', self_curable: 'Yes', doctortype: 'Urologist', other_symptoms: 'Burning urination, frequent urge, cloudy urine' },
  { diseasename: 'Psoriasis', basic_remedy: 'Topical treatments, phototherapy, biologics', self_curable: 'No', doctortype: 'Dermatologist', other_symptoms: 'Red patches, silvery scales, dry skin' },
  { diseasename: 'Acne', basic_remedy: 'Topical benzoyl peroxide, retinoids', self_curable: 'Yes', doctortype: 'Dermatologist', other_symptoms: 'Pimples, blackheads, skin inflammation' },
  { diseasename: 'Impetigo', basic_remedy: 'Topical or oral antibiotics', self_curable: 'Yes', doctortype: 'Dermatologist', other_symptoms: 'Red sores, blisters, honey-colored crust' },
]

async function seedDiseases() {
  console.log('🌱 Seeding diseases table...')
  
  // Try inserting one row first to discover column names
  const { error: testError } = await supabase.from('diseases').insert(diseases[0])
  if (testError) {
    console.error('Column check error:', testError.message)
    
    // Try with snake_case column names instead
    console.log('\nTrying snake_case column names...')
    const snakeRow = {
      disease_name: diseases[0].diseasename,
      basic_remedy: diseases[0].basic_remedy,
      self_curable: diseases[0].self_curable,
      doctortype: diseases[0].doctortype,
      other_symptoms: diseases[0].other_symptoms,
    }
    const { error: snakeError } = await supabase.from('diseases').insert(snakeRow)
    if (snakeError) {
      console.error('snake_case also failed:', snakeError.message)
      console.log('\n⚠️  Run this SQL in Supabase dashboard to see actual columns:')
      console.log('SELECT column_name FROM information_schema.columns WHERE table_name = \'diseases\';')
    } else {
      console.log('✅ snake_case works! Inserting all diseases with snake_case...')
      const rows = diseases.map(d => ({
        disease_name: d.diseasename,
        basic_remedy: d.basic_remedy,
        self_curable: d.self_curable,
        doctortype: d.doctortype,
        other_symptoms: d.other_symptoms,
      }))
      const { data, error } = await supabase.from('diseases').insert(rows.slice(1))
      if (error) console.error('Batch insert error:', error.message)
      else console.log(`✅ Inserted ${rows.length} diseases total`)
    }
  } else {
    console.log('✅ camelCase works! Inserting remaining...')
    const { data, error } = await supabase.from('diseases').insert(diseases.slice(1))
    if (error) console.error('Batch error:', error.message)
    else console.log(`✅ Inserted ${diseases.length} diseases total`)
  }
  process.exit(0)
}

seedDiseases()
