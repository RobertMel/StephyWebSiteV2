-- Create products table for Perfumes loves by Stephy
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Produit à nommer',
  category TEXT NOT NULL DEFAULT 'parfums' CHECK (category IN ('parfums', 'soins', 'cosmetiques')),
  price DECIMAL(10, 2) DEFAULT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products (public storefront)
CREATE POLICY "Allow public read access to products" ON public.products
  FOR SELECT USING (true);

-- Allow anyone to update products (simple admin without auth)
CREATE POLICY "Allow public update access to products" ON public.products
  FOR UPDATE USING (true);

-- Allow anyone to insert products (for seeding)
CREATE POLICY "Allow public insert access to products" ON public.products
  FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
