-- Create Food Requests Table (Receiver requesting food from NGO)
CREATE TABLE IF NOT EXISTS food_requests (
    id SERIAL PRIMARY KEY,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ngo_id INTEGER NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    requested_quantity INT DEFAULT 1,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'requested', -- requested, approved, fulfilled, rejected
    fulfilled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
