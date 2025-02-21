CREATE TABLE skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    resource_bifurcation_id UUID REFERENCES resource_bifurcations(id),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('must_have', 'nice_to_have')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);