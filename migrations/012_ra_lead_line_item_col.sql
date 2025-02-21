-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the main table
CREATE TABLE ra_lead_line_item_col (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id BIGINT REFERENCES ra_users_duplicate(id),
    temporary_token UUID UNIQUE,
    token_expiry TIMESTAMPTZ,
    domain VARCHAR(100) NOT NULL,
    tech_skills TEXT[],
    jd_filename VARCHAR(255),
    jd_fileurl TEXT,
    chats JSONB,
    must_have TEXT[],
    good_to_have TEXT[],
    experience VARCHAR(50),
    seniority VARCHAR(50),
    engagement_duration VARCHAR(100),
    budget VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on temporary_token for faster lookups
CREATE INDEX idx_ra_lead_line_item_col_temp_token ON ra_lead_line_item_col(temporary_token);

-- Create index on user_id for faster user lookups
CREATE INDEX idx_ra_lead_line_item_col_user_id ON ra_lead_line_item_col(user_id);

-- Create index on token_expiry for cleanup queries
CREATE INDEX idx_ra_lead_line_item_col_expiry ON ra_lead_line_item_col(token_expiry);

-- Create function to cleanup expired records
CREATE OR REPLACE FUNCTION cleanup_expired_records()
RETURNS void AS $$
BEGIN
    DELETE FROM ra_lead_line_item_col
    WHERE token_expiry < NOW()
    AND user_id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup to run daily at midnight
SELECT cron.schedule('cleanup_expired_records', '0 0 * * *', $$
    SELECT cleanup_expired_records();
$$);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ra_lead_line_item_col_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ra_lead_line_item_col_updated_at
    BEFORE UPDATE ON ra_lead_line_item_col
    FOR EACH ROW
    EXECUTE FUNCTION update_ra_lead_line_item_col_updated_at();

-- Add comments for documentation
COMMENT ON TABLE ra_lead_line_item_col IS 'Stores job requirements and user selections before and after signup';
COMMENT ON COLUMN ra_lead_line_item_col.temporary_token IS 'Temporary token for tracking pre-signup flow, cleared after signup';
COMMENT ON COLUMN ra_lead_line_item_col.token_expiry IS 'Expiration timestamp for temporary tokens, cleared after signup';
COMMENT ON COLUMN ra_lead_line_item_col.tech_skills IS 'Array of selected technical skills';
COMMENT ON COLUMN ra_lead_line_item_col.chats IS 'JSON storage of chat history between user and assistant';
COMMENT ON COLUMN ra_lead_line_item_col.must_have IS 'Array of must-have skills identified during the process';
COMMENT ON COLUMN ra_lead_line_item_col.good_to_have IS 'Array of good-to-have skills identified during the process';
