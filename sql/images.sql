-- JOVE Admin: Image/Gallery Management
CREATE TABLE IF NOT EXISTS site_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read images" ON site_images FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON site_images FOR ALL USING (true);

-- Storage bucket (run in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);
