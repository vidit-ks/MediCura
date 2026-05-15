import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Add columns via separate insert/select probing
// Use pg REST directly with service role for DDL
const url = `${process.env.SUPABASE_URL}/rest/v1/`

try {
  // Try inserting with all columns — if it fails, we know columns are missing
  const { error: e1 } = await supabase.from('ehrs').insert({
    user_id: 'f8ca600e-1758-4ffb-850d-ed776f144a2c',
    filename: 'schema_test.pdf',
    download_url: null,
    description: 'Schema test',
    extracted_text: 'test',
    ai_summary: 'test'
  }).select().single()

  if (e1 && e1.message.includes("column")) {
    console.log('Missing columns:', e1.message)
    console.log('\nPlease run this SQL in your Supabase Dashboard > SQL Editor:')
    console.log('ALTER TABLE ehrs ADD COLUMN IF NOT EXISTS extracted_text text;')
    console.log('ALTER TABLE ehrs ADD COLUMN IF NOT EXISTS ai_summary text;')
  } else if (!e1) {
    console.log('✅ Columns already exist or were added successfully')
    // Clean up
    await supabase.from('ehrs').delete().eq('description', 'Schema test')
  } else {
    console.log('Other error:', e1.message)
  }
} catch(e) {
  console.log('Error:', e.message)
}
