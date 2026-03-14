-- JOVE Admin: Popup/Banner Management
CREATE TABLE IF NOT EXISTS site_popups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  position TEXT DEFAULT 'center' CHECK (position IN ('center', 'top', 'bottom')),
  is_active BOOLEAN DEFAULT false,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE site_popups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active popups" ON site_popups FOR SELECT USING (is_active = true AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));
CREATE POLICY "Admin full access" ON site_popups FOR ALL USING (true);
