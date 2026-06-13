-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create the RSVPs table
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  assignment TEXT CHECK (assignment IN ('Tiki', 'Vampire')),
  message TEXT
);

-- Enable Row Level Security
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert RSVPs (guests submitting the form)
CREATE POLICY "Anyone can insert RSVPs" ON rsvps
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users (admin) to read all RSVPs
CREATE POLICY "Authenticated users can read RSVPs" ON rsvps
  FOR SELECT
  USING (auth.role() = 'authenticated');