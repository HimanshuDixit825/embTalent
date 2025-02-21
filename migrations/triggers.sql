CREATE TRIGGER update_ra_users_updated_at
    BEFORE UPDATE ON ra_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_bifurcations_updated_at
    BEFORE UPDATE ON resource_bifurcations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ra_leads_updated_at
    BEFORE UPDATE ON ra_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ra_lead_line_items_updated_at
    BEFORE UPDATE ON ra_lead_line_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applicant_cvs_updated_at
    BEFORE UPDATE ON applicant_cvs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();