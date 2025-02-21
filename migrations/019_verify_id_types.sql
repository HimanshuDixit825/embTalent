-- Verify and fix column types to ensure BIGINT/int8

-- First, verify the current types
DO $$ 
DECLARE
    users_id_type text;
    line_item_user_id_type text;
BEGIN
    -- Get the type of id column in ra_users_duplicate
    SELECT pg_typeof(id)::text 
    INTO users_id_type 
    FROM ra_users_duplicate 
    LIMIT 1;

    -- Get the type of user_id column in ra_lead_line_item_col
    SELECT pg_typeof(user_id)::text 
    INTO line_item_user_id_type 
    FROM ra_lead_line_item_col 
    LIMIT 1;

    -- Log the current types
    RAISE NOTICE 'Current types - ra_users_duplicate.id: %, ra_lead_line_item_col.user_id: %', 
        users_id_type, line_item_user_id_type;

    -- If either is not bigint, we'll fix it
    IF users_id_type != 'bigint' OR line_item_user_id_type != 'bigint' THEN
        -- Drop the foreign key constraint first
        ALTER TABLE ra_lead_line_item_col 
        DROP CONSTRAINT IF EXISTS ra_lead_line_item_col_user_id_fkey;

        -- Alter ra_users_duplicate.id if needed
        IF users_id_type != 'bigint' THEN
            ALTER TABLE ra_users_duplicate 
            ALTER COLUMN id TYPE bigint;
        END IF;

        -- Alter ra_lead_line_item_col.user_id if needed
        IF line_item_user_id_type != 'bigint' THEN
            ALTER TABLE ra_lead_line_item_col 
            ALTER COLUMN user_id TYPE bigint;
        END IF;

        -- Recreate the foreign key constraint
        ALTER TABLE ra_lead_line_item_col
        ADD CONSTRAINT ra_lead_line_item_col_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES ra_users_duplicate(id);
    END IF;
END $$;

-- Add comment to document the verification
COMMENT ON COLUMN ra_users_duplicate.id IS 'Primary key (BIGINT/int8)';
COMMENT ON COLUMN ra_lead_line_item_col.user_id IS 'Foreign key reference to ra_users_duplicate.id (BIGINT/int8)';
