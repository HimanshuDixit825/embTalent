CREATE POLICY "Users can view their own data"
ON ra_users FOR SELECT
USING (auth.uid()::text = userid::text);

CREATE POLICY "Users can view their own leads"
ON ra_leads FOR SELECT
USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can view their lead line items"
ON ra_lead_line_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM ra_leads
        WHERE ra_leads.id = ra_lead_line_items.lead_id
        AND ra_leads.user_id::text = auth.uid()::text
    )
);

-- Create policies for insert operations
CREATE POLICY "Users can insert their own data"
ON ra_users FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can insert leads"
ON ra_leads FOR INSERT
WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can insert line items"
ON ra_lead_line_items FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM ra_leads
        WHERE ra_leads.id = lead_id
        AND ra_leads.user_id::text = auth.uid()::text
    )
);