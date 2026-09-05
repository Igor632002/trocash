-- Row Level Security policies for troCASH
-- Adjust column names if your schema differs
-- Note: CREATE POLICY has no "IF NOT EXISTS" clause, so we DROP POLICY IF EXISTS first.

-- Enable RLS on offers (run once in Supabase SQL editor)
ALTER TABLE IF EXISTS offers ENABLE ROW LEVEL SECURITY;

-- Allow inserts where owner_id matches the authenticated user
DROP POLICY IF EXISTS "Allow owners to insert their offers" ON offers;
CREATE POLICY "Allow owners to insert their offers"
  ON offers
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Allow owners to update their own offers
DROP POLICY IF EXISTS "Allow owners to update their offers" ON offers;
CREATE POLICY "Allow owners to update their offers"
  ON offers
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

-- Allow owners to delete their own offers
DROP POLICY IF EXISTS "Allow owners to delete their offers" ON offers;
CREATE POLICY "Allow owners to delete their offers"
  ON offers
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Allow authenticated users to select active offers
DROP POLICY IF EXISTS "Allow select active offers" ON offers;
CREATE POLICY "Allow select active offers"
  ON offers
  FOR SELECT
  USING (status = 'active');

-- exchange_requests: allow authenticated users to create requests where proposer_id = auth.uid()
ALTER TABLE IF EXISTS exchange_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow proposer insert" ON exchange_requests;
CREATE POLICY "Allow proposer insert"
  ON exchange_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (proposer_id = auth.uid());

DROP POLICY IF EXISTS "Allow proposer view their requests" ON exchange_requests;
CREATE POLICY "Allow proposer view their requests"
  ON exchange_requests
  FOR SELECT
  USING (proposer_id = auth.uid());

-- category & location: public reference data, readable by anyone (anon + authenticated)
ALTER TABLE IF EXISTS category ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read category" ON category;
CREATE POLICY "Allow public read category"
  ON category
  FOR SELECT
  TO anon, authenticated
  USING (true);

ALTER TABLE IF EXISTS location ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read location" ON location;
CREATE POLICY "Allow public read location"
  ON location
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Note: apply these in Supabase SQL editor. Tailor policies to your schema and app needs.

