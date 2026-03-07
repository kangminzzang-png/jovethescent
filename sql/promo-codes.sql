-- JOVE THE SCENT — Promo Code System
-- Run this in Supabase Dashboard > SQL Editor

-- 1. Promo Codes Table
CREATE TABLE promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_amount INTEGER NOT NULL DEFAULT 27000,  -- ₩27,000 (Scrolls price)
  discount_type TEXT NOT NULL DEFAULT 'fixed',      -- 'fixed' or 'percent'
  valid_for TEXT[] DEFAULT ARRAY['genesis-i', 'breath-of-eden', 'hawa'],  -- 50ml products only
  min_order_amount INTEGER DEFAULT 0,
  
  -- Usage tracking
  max_uses INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMPTZ,
  
  -- Source tracking
  source TEXT DEFAULT 'scrolls_purchase',  -- why this code was created
  source_order_id UUID,                     -- linked to original Scrolls order
  created_for_email TEXT,                   -- who it was generated for
  
  -- Validity
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '6 months'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index for fast code lookup
CREATE INDEX idx_promo_code ON promo_codes(code);
CREATE INDEX idx_promo_active ON promo_codes(is_active, expires_at);

-- 3. RLS (Row Level Security)
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can validate a code (read by code)
CREATE POLICY "Anyone can validate promo codes"
  ON promo_codes FOR SELECT
  USING (true);

-- Only service role can insert/update (backend or admin)
-- For now, allow authenticated users to use codes (update used_count)
CREATE POLICY "Authenticated users can use promo codes"
  ON promo_codes FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 4. Function to validate and apply a promo code
CREATE OR REPLACE FUNCTION validate_promo_code(
  p_code TEXT,
  p_product_id TEXT,
  p_order_amount INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_promo promo_codes%ROWTYPE;
  v_result JSON;
BEGIN
  -- Find the code
  SELECT * INTO v_promo
  FROM promo_codes
  WHERE code = UPPER(TRIM(p_code))
    AND is_active = true
    AND expires_at > NOW()
    AND used_count < max_uses;

  IF NOT FOUND THEN
    RETURN json_build_object('valid', false, 'error', 'invalid_or_expired');
  END IF;

  -- Check if product is eligible
  IF NOT (p_product_id = ANY(v_promo.valid_for)) THEN
    RETURN json_build_object('valid', false, 'error', 'product_not_eligible');
  END IF;

  -- Check minimum order amount
  IF p_order_amount < v_promo.min_order_amount THEN
    RETURN json_build_object('valid', false, 'error', 'min_amount_not_met');
  END IF;

  -- Return discount info
  RETURN json_build_object(
    'valid', true,
    'discount_amount', v_promo.discount_amount,
    'discount_type', v_promo.discount_type,
    'code', v_promo.code
  );
END;
$$;

-- 5. Function to redeem a promo code
CREATE OR REPLACE FUNCTION redeem_promo_code(
  p_code TEXT,
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_promo promo_codes%ROWTYPE;
BEGIN
  SELECT * INTO v_promo
  FROM promo_codes
  WHERE code = UPPER(TRIM(p_code))
    AND is_active = true
    AND expires_at > NOW()
    AND used_count < max_uses
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'invalid_or_used');
  END IF;

  UPDATE promo_codes
  SET used_count = used_count + 1,
      used_by = p_user_id,
      used_at = NOW()
  WHERE id = v_promo.id;

  RETURN json_build_object(
    'success', true,
    'discount_amount', v_promo.discount_amount
  );
END;
$$;

-- 6. Function to generate a promo code (for admin/backend use)
CREATE OR REPLACE FUNCTION generate_scrolls_promo(
  p_email TEXT DEFAULT NULL,
  p_order_id UUID DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code TEXT;
BEGIN
  -- Generate unique code: JOVE-XXXX (4 random alphanumeric)
  LOOP
    v_code := 'JOVE-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM promo_codes WHERE code = v_code);
  END LOOP;

  INSERT INTO promo_codes (code, created_for_email, source_order_id, source)
  VALUES (v_code, p_email, p_order_id, 'scrolls_purchase');

  RETURN v_code;
END;
$$;
