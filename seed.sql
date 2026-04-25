-- Create the products table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  arabic TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  tagline TEXT NOT NULL,
  purpose TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT NOT NULL,
  accent TEXT NOT NULL,
  bg TEXT NOT NULL,
  description TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  how_to_use TEXT NOT NULL,
  scent TEXT NOT NULL,
  size TEXT NOT NULL,
  stock BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products (Public read access)
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

-- Insert the product data
INSERT INTO public.products (id, name, arabic, subtitle, tagline, purpose, price, image, accent, bg, description, ingredients, how_to_use, scent, size, stock)
VALUES 
  (
    'shaghaf', 
    'Shaghaf', 
    'شغف', 
    'Hydrating & Frizz Control', 
    'Fuel Your Passion', 
    'Hydration', 
    39, 
    '/assets/product-1.jpeg', 
    '#5a6b47', 
    '#eef0ea', 
    'Shaghaf is our signature hydrating formula, blended from cold-pressed Argan and pure Jojoba oil. It penetrates deeply to tame frizz and deliver all-day moisture without any greasy residue.', 
    ARRAY['Argan Oil', 'Jojoba Oil', 'Sweet Almond Oil', 'Vitamin E', 'Cedarwood Essential Oil'], 
    'Apply 3-5 drops to palm, rub hands together, then work through dry or damp beard from root to tip. Use daily after cleansing.', 
    'Warm Cedar & Sandalwood with earthy undertones.', 
    '30ml', 
    true
  ),
  (
    'roab', 
    'Ro''ab', 
    'رُعب', 
    'Follicle Growth Support', 
    'Command Respect', 
    'Growth', 
    39, 
    '/assets/product-2.jpeg', 
    '#4a4a4a', 
    '#ebebeb', 
    'Ro''ab stimulates dormant follicles using a powerful blend of Castor and Rosemary oil. Designed for men serious about achieving a fuller, thicker beard.', 
    ARRAY['Castor Oil', 'Rosemary Oil', 'Biotin Complex', 'Black Seed Oil', 'Peppermint Oil'], 
    'Massage 4-6 drops into the beard and underlying skin using fingertips. Leave on overnight for maximum penetration. Use 4-5 times per week.', 
    'Fresh Mint & Herbs with a cool finish.', 
    '30ml', 
    true
  ),
  (
    'addawa', 
    'Ad''Dawa', 
    'الدواء', 
    'Healing & Itch Relief', 
    'The Remedy', 
    'Healing', 
    39, 
    '/assets/product-3.jpeg', 
    '#c8a45e', 
    '#f5eddc', 
    'Ad''Dawa is the remedy. Formulated with anti-inflammatory Tea Tree and Calendula extract, it eliminates beardruff, soothes irritation, and heals the skin beneath the beard.', 
    ARRAY['Tea Tree Oil', 'Calendula Extract', 'Chamomile Oil', 'Aloe Vera', 'Lavender Oil'], 
    'Apply 3-4 drops directly to itchy or flaky areas. Massage gently into skin. Use twice daily until irritation subsides, then maintain with 3x per week.', 
    'Clean Floral & Herbal with a calming softness.', 
    '30ml', 
    true
  ),
  (
    'qawwam', 
    'Qawwam', 
    'قوّام', 
    'Strength & Structure', 
    'For Alpha Males', 
    'Strength', 
    45, 
    '/assets/product-4.jpeg', 
    '#1a1a1a', 
    '#d6d4cf', 
    'Qawwam is our most powerful formula, engineered for strength. A potent blend of Black Seed oil and Pumpkin Seed strengthens each strand from the root, reducing breakage and building a beard of remarkable density.', 
    ARRAY['Black Seed Oil', 'Pumpkin Seed Oil', 'Vitamin D3', 'Caffeine Extract', 'Grapeseed Oil'], 
    'Warm 5-6 drops between palms. Apply to beard from root to tip, massaging vigorously at the skin level. Use daily morning routine.', 
    'Dark Oud & Amber, bold and commanding.', 
    '30ml', 
    true
  ),
  (
    'muhafiz', 
    'Muhafiz', 
    'محافظ', 
    'Protection & Defence', 
    'Guard Your Legacy', 
    'Protection', 
    39, 
    '/assets/product-5.jpeg', 
    '#6b8499', 
    '#dce5ec', 
    'Muhafiz is your beard''s shield. Crafted with UV-protective Carrot Seed oil and antioxidant-rich Sea Buckthorn, it defends against environmental damage, pollution, and harsh weather.', 
    ARRAY['Carrot Seed Oil', 'Sea Buckthorn', 'Zinc Oxide', 'Vitamin C', 'Shea Butter'], 
    'Apply 4-5 drops before going outdoors. Work through beard evenly. Re-apply after swimming or exposure to harsh elements.', 
    'Fresh Ocean Breeze & Citrus.', 
    '30ml', 
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  arabic = EXCLUDED.arabic,
  subtitle = EXCLUDED.subtitle,
  tagline = EXCLUDED.tagline,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use;
