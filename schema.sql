-- ShareMeal Users Table Schema
-- Run this script in Supabase's SQL Editor (Project -> SQL Editor)

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('donor', 'receiver', 'ngo', 'admin')) NOT NULL,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Verify table creation:
SELECT * FROM users;

-- ShareMeal FoodPosts Table Schema
CREATE TABLE IF NOT EXISTS FoodPosts (
    id SERIAL PRIMARY KEY,
    donor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    food_type VARCHAR(100) NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location_latitude DECIMAL(9,6) NOT NULL,
    location_longitude DECIMAL(9,6) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_foodposts_donor_id ON FoodPosts(donor_id);
CREATE INDEX IF NOT EXISTS idx_foodposts_status ON FoodPosts(status);
CREATE INDEX IF NOT EXISTS idx_foodposts_location ON FoodPosts(location_latitude, location_longitude);

