import dotenv from 'dotenv'
dotenv.config()

// Run DDL via Supabase pg endpoint
async function runSQL(sql) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({ query: sql })
  })
  return { status: res.status, body: await res.text() }
}

// Try via management API instead
const mgmtRes = await fetch(
  `https://api.supabase.com/v1/projects/jxehwxyljvnltisaohzv/database/query`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` },
    body: JSON.stringify({ query: 'ALTER TABLE ehrs ADD COLUMN IF NOT EXISTS extracted_text text; ALTER TABLE ehrs ADD COLUMN IF NOT EXISTS ai_summary text;' })
  }
)
console.log('Management API status:', mgmtRes.status)
console.log('Response:', (await mgmtRes.text()).slice(0, 300))
