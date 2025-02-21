CREATE TABLE ra_leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    emb_lead_id VARCHAR(20) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES ra_users(id),
    lead_status VARCHAR(50) DEFAULT 'active',
    status BOOLEAN DEFAULT true,
    created_by BIGINT,
    updated_by BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
