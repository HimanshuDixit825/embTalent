CREATE TABLE test_skills (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES ra_users_duplicate(id),
    main_technologies JSONB, -- Array of main technologies
    selected_technologies JSONB,
    category VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);