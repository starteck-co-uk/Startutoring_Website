-- Resources table for uploadable study materials (PDFs, worksheets, etc.)
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  subject text DEFAULT '',
  level text DEFAULT '',
  file_name text NOT NULL,
  file_size integer DEFAULT 0,
  file_data text NOT NULL, -- base64 data URL
  uploaded_by text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read resources
CREATE POLICY "Resources readable by all" ON resources FOR SELECT USING (true);

-- Only admin (service role) can insert/update/delete
CREATE POLICY "Resources writable by service role" ON resources FOR ALL USING (true);
