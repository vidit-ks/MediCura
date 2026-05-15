import supabase from '../lib/supabase.js'

// Symptom-to-disease mapping (covers all 39 diseases in the Supabase diseases table)
const SYMPTOM_DISEASE_MAP = [
  { disease: 'Fungal infection',       symptoms: ['itching','skin rash','nodal skin eruptions','dischromic patches','skin peeling','blister'] },
  { disease: 'Allergy',                symptoms: ['continuous sneezing','shivering','chills','watering from eyes','swollen eyes','runny nose'] },
  { disease: 'GERD',                   symptoms: ['stomach pain','acidity','ulcers on tongue','vomiting','cough','chest pain'] },
  { disease: 'Chronic cholestasis',    symptoms: ['itching','vomiting','yellowish skin','nausea','loss of appetite','abdominal pain'] },
  { disease: 'Drug Reaction',          symptoms: ['itching','skin rash','stomach pain','burning micturition','spotting urination'] },
  { disease: 'Peptic ulcer disease',   symptoms: ['vomiting','loss of appetite','abdominal pain','indigestion','passage of gases','internal itching'] },
  { disease: 'AIDS',                   symptoms: ['muscle wasting','patches in throat','high fever','extra marital contacts','fatigue'] },
  { disease: 'Diabetes',               symptoms: ['fatigue','weight loss','restlessness','lethargy','irregular sugar level','blurred and distorted vision','obesity','excessive hunger','increased appetite','polyuria'] },
  { disease: 'Gastroenteritis',        symptoms: ['vomiting','sunken eyes','dehydration','diarrhoea'] },
  { disease: 'Bronchial Asthma',       symptoms: ['fatigue','cough','high fever','breathlessness','family history','mucoid sputum'] },
  { disease: 'Hypertension',           symptoms: ['headache','chest pain','dizziness','loss of balance','lack of concentration'] },
  { disease: 'Migraine',               symptoms: ['headache','acidity','indigestion','blurred and distorted vision','excessive hunger','stiff neck','depression','irritability','visual disturbances'] },
  { disease: 'Cervical spondylosis',   symptoms: ['back pain','weakness in limbs','neck pain','dizziness','loss of balance'] },
  { disease: 'Paralysis',              symptoms: ['vomiting','altered sensorium','facial palsy','weakness in limbs','headache','blurred and distorted vision'] },
  { disease: 'Jaundice',               symptoms: ['itching','vomiting','fatigue','weight loss','high fever','yellowish skin','dark urine','abdominal pain'] },
  { disease: 'Malaria',                symptoms: ['chills','vomiting','high fever','sweating','headache','nausea','diarrhoea','muscle pain'] },
  { disease: 'Chicken pox',            symptoms: ['itching','skin rash','fatigue','lethargy','high fever','headache','loss of appetite','mild fever','swelled lymph nodes','malaise','red spots over body'] },
  { disease: 'Dengue',                 symptoms: ['skin rash','chills','joint pain','vomiting','fatigue','headache','nausea','loss of appetite','pain behind the eyes','back pain','malaise','high fever','red spots over body','muscle pain'] },
  { disease: 'Typhoid',                symptoms: ['chills','vomiting','fatigue','high fever','headache','nausea','constipation','abdominal pain','diarrhoea','toxic look','belly pain'] },
  { disease: 'Hepatitis A',            symptoms: ['joint pain','vomiting','yellowish skin','dark urine','nausea','loss of appetite','abdominal pain','diarrhoea','mild fever','yellowing of eyes','muscle pain'] },
  { disease: 'Hepatitis B',            symptoms: ['itching','fatigue','lethargy','yellowish skin','dark urine','loss of appetite','abdominal pain','yellow urine','yellowing of eyes','malaise','receiving blood transfusion'] },
  { disease: 'Hepatitis C',            symptoms: ['fatigue','yellowish skin','nausea','loss of appetite','family history','yellowing of eyes'] },
  { disease: 'Hepatitis D',            symptoms: ['joint pain','vomiting','fatigue','yellowish skin','dark urine','nausea','loss of appetite','abdominal pain','yellowing of eyes'] },
  { disease: 'Hepatitis E',            symptoms: ['joint pain','vomiting','fatigue','high fever','yellowish skin','dark urine','nausea','loss of appetite','abdominal pain','yellowing of eyes','coma','stomach bleeding'] },
  { disease: 'Alcoholic hepatitis',    symptoms: ['vomiting','yellowish skin','abdominal pain','swelling of stomach','distention of abdomen','history of alcohol consumption','fluid overload'] },
  { disease: 'Tuberculosis',           symptoms: ['chills','vomiting','fatigue','weight loss','cough','high fever','breathlessness','sweating','loss of appetite','mild fever','yellowing of eyes','swelled lymph nodes','malaise','phlegm','blood in sputum'] },
  { disease: 'Common Cold',            symptoms: ['continuous sneezing','chills','fatigue','cough','high fever','headache','swelled lymph nodes','malaise','phlegm','runny nose','congestion','chest pain','loss of smell','throat irritation','redness of eyes','sinus pressure','muscle pain'] },
  { disease: 'Pneumonia',              symptoms: ['chills','fatigue','cough','high fever','breathlessness','sweating','malaise','phlegm','blood in sputum','rusty sputum'] },
  { disease: 'Dimorphic hemmorhoids',  symptoms: ['constipation','pain during bowel movements','pain in anal region','bloody stool','irritation in anus'] },
  { disease: 'Heart attack',           symptoms: ['vomiting','breathlessness','sweating','chest pain'] },
  { disease: 'Varicose veins',         symptoms: ['fatigue','cramps','bruising','obesity','swollen legs','swollen blood vessels','prominent veins on calf'] },
  { disease: 'Hypothyroidism',         symptoms: ['fatigue','weight gain','cold hands and feets','mood swings','lethargy','dryness','brittle nails','swollen extremities','depression','irritability','abnormal menstruation'] },
  { disease: 'Hyperthyroidism',        symptoms: ['fatigue','mood swings','weight loss','restlessness','sweating','diarrhoea','fast heart rate','excessive hunger','muscle weakness','irritability','abnormal menstruation'] },
  { disease: 'Hypoglycemia',           symptoms: ['vomiting','fatigue','anxiousness','sweating','headache','nausea','blurred and distorted vision','excessive hunger','slurred speech','irritability','palpitations','drying and tingling lips'] },
  { disease: 'Osteoarthritis',         symptoms: ['joint pain','neck pain','knee pain','hip joint pain','swelling joints','painful walking'] },
  { disease: 'Arthritis',              symptoms: ['muscle weakness','stiff neck','swelling joints','movement stiffness','painful walking'] },
  { disease: '(vertigo) Paroymsal Positional Vertigo', symptoms: ['vomiting','headache','nausea','hearing loss','fullness in ear','spinning movements','loss of balance','unsteadiness'] },
  { disease: 'Acne',                   symptoms: ['skin rash','pus filled pimples','blackheads','scurring'] },
  { disease: 'Urinary tract infection',symptoms: ['burning micturition','bladder discomfort','foul smell of urine','continuous feel of urine','cloudy urine'] },
  { disease: 'Psoriasis',              symptoms: ['skin rash','joint pain','skin peeling','silver like dusting','small dents in nails','inflammatory nails'] },
  { disease: 'Impetigo',               symptoms: ['skin rash','high fever','blister','red sore around nose','yellow crust ooze'] },
]

export const predictDisease = async (req, res, next) => {
  try {
    const prompt = (req.body.prompt || '').toLowerCase()

    if (!prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Please describe your symptoms' })
    }

    // Score each disease by counting how many of its symptom keywords appear in the prompt
    const scored = SYMPTOM_DISEASE_MAP.map(entry => {
      const matches = entry.symptoms.filter(sym => prompt.includes(sym.toLowerCase()))
      return { disease: entry.disease, score: matches.length, matched: matches }
    }).sort((a, b) => b.score - a.score)

    const best = scored[0]
    const predictedLabel = best.disease

    console.log(`Predicted: "${predictedLabel}" (${best.score} symptom matches: ${best.matched.join(', ')})`)

    // Fetch full disease info from Supabase
    const { data: diseaseDetails, error } = await supabase
      .from('diseases')
      .select('*')
      .ilike('disease_name', predictedLabel)
      .single()

    if (error) {
      console.log('Disease not in DB, using fallback:', error.message)
    }

    res.status(200).json({
      success: true,
      message: 'Predicted successfully',
      data: diseaseDetails || {
        disease_name: predictedLabel,
        basic_remedy: 'Please consult a doctor.',
        self_curable: 'No',
        doctor_type: 'General Physician',
        other_symptoms: best.matched.join(', ') || 'N/A'
      }
    })
  } catch (e) {
    console.log(`Prediction error: ${e}`)
    res.status(400).json({ success: false, message: 'Failed to predict', error: e.message })
  }
}