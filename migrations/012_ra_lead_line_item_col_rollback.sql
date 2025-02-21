-- Drop the scheduled job first
SELECT cron.unschedule('cleanup_expired_records');

-- Drop the trigger
DROP TRIGGER IF EXISTS trigger_update_ra_lead_line_item_col_updated_at ON ra_lead_line_item_col;

-- Drop the trigger function
DROP FUNCTION IF EXISTS update_ra_lead_line_item_col_updated_at();

-- Drop the cleanup function
DROP FUNCTION IF EXISTS cleanup_expired_records();

-- Drop the indexes
DROP INDEX IF EXISTS idx_ra_lead_line_item_col_temp_token;
DROP INDEX IF EXISTS idx_ra_lead_line_item_col_user_id;
DROP INDEX IF EXISTS idx_ra_lead_line_item_col_expiry;

-- Drop the main table
DROP TABLE IF EXISTS ra_lead_line_item_col;
