-- First, drop the default uuid_generate_v4() constraint
ALTER TABLE ra_users_duplicate 
ALTER COLUMN userid DROP DEFAULT;

-- Then change the column type to VARCHAR
ALTER TABLE ra_users_duplicate 
ALTER COLUMN userid TYPE VARCHAR(255);
