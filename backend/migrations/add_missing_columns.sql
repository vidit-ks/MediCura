-- Run this in your Supabase SQL Editor:
-- Go to https://supabase.com/dashboard/project/jxehwxyljvnltisaohzv/sql/new

-- Add missing gender column to doctors table
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS gender VARCHAR(20);

-- Add missing blood_type column to users table (if not present)
ALTER TABLE users ADD COLUMN IF NOT EXISTS blood_type VARCHAR(10);
