CREATE TABLE lead_line_item_skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_line_item_id UUID REFERENCES ra_lead_line_items(id),
    skill_id UUID REFERENCES skills(id),
    skill_type VARCHAR(20) CHECK (skill_type IN ('must_have', 'nice_to_have')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);