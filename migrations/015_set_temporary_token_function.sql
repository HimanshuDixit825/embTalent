-- Function to set temporary token in session context
CREATE OR REPLACE FUNCTION set_temporary_token(token text)
RETURNS void AS $$
BEGIN
  -- Set the token in the local transaction context
  PERFORM set_config('app.temporary_token', token, true);
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to public
GRANT EXECUTE ON FUNCTION set_temporary_token(text) TO PUBLIC;

-- Comment explaining usage
COMMENT ON FUNCTION set_temporary_token(text) IS 'Sets the temporary token in the current session context for RLS policies';
