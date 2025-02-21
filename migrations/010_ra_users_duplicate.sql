CREATE TABLE ra_users_duplicate (
    id BIGSERIAL PRIMARY KEY,
    userid UUID DEFAULT uuid_generate_v4() UNIQUE,
    email VARCHAR(120) UNIQUE NOT NULL,
    name VARCHAR(512) NOT NULL,
    company_name VARCHAR(512),
    password VARCHAR(255) NOT NULL,
    country_code VARCHAR(8),
    mobile_number VARCHAR(20),
    status BOOLEAN DEFAULT true,
    created_by BIGINT,
    updated_by BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ DEFAULT NOW()
);