-- Add missing columns to users table for complete user profile
ALTER TABLE users
ADD COLUMN IF NOT EXISTS nid VARCHAR(50),
ADD COLUMN IF NOT EXISTS nid_pdf BYTEA,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS plain_password TEXT,
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS encrypted_name TEXT,
ADD COLUMN IF NOT EXISTS encrypted_nid TEXT;

-- Create indexes for commonly searched fields
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);
