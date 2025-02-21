-- Create a stored procedure to link record to user
CREATE OR REPLACE PROCEDURE link_record_to_user(
    p_temporary_token UUID,
    p_user_id BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER -- Run with owner privileges to bypass RLS
AS $$
BEGIN
    UPDATE ra_lead_line_item_col
    SET 
        user_id = p_user_id,
        temporary_token = NULL,
        token_expiry = NULL
    WHERE temporary_token = p_temporary_token;
END;
$$;

-- Grant execute permission to public
GRANT EXECUTE ON PROCEDURE link_record_to_user(UUID, BIGINT) TO PUBLIC;
