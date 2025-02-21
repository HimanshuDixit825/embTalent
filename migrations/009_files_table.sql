CREATE TABLE ra_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES ra_leads(id),
    lead_line_item_id UUID REFERENCES ra_lead_line_items(id),
    file_type VARCHAR(50),
    file_url TEXT NOT NULL,
    filename VARCHAR(256) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
