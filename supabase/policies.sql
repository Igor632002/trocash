-- Row Level Security policies for troCASH
-- Adjust column names if your schema differs

-- Enable RLS on offers (run once in Supabase SQL editor)
ALTER TABLE IF EXISTS offers ENABLE ROW LEVEL SECURITY;

-- Allow inserts where owner_id matches the authenticated user
CREATE POLICY IF NOT EXISTS "Allow owners to insert their offers"
  ON offers
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Allow owners to update/delete their own offers
CREATE POLICY IF NOT EXISTS "Allow owners to modify their offers"
  ON offers
  FOR UPDATE, DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Allow authenticated users to select active offers
CREATE POLICY IF NOT EXISTS "Allow select active offers"
  ON offers
  FOR SELECT
  USING (status = 'active');

-- exchange_requests: allow authenticated users to create requests where proposer_id = auth.uid()
ALTER TABLE IF EXISTS exchange_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow proposer insert"
  ON exchange_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (proposer_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Allow proposer view their requests"
  ON exchange_requests
  FOR SELECT
  USING (proposer_id = auth.uid());

-- Note: apply these in Supabase SQL editor. Tailor policies to your schema and app needs.
