-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image TEXT,
  size_p INTEGER NOT NULL DEFAULT 0 CHECK (size_p >= 0),
  size_m INTEGER NOT NULL DEFAULT 0 CHECK (size_m >= 0),
  size_g INTEGER NOT NULL DEFAULT 0 CHECK (size_g >= 0),
  size_gg INTEGER NOT NULL DEFAULT 0 CHECK (size_gg >= 0),
  size_xg INTEGER NOT NULL DEFAULT 0 CHECK (size_xg >= 0),
  size_xgg INTEGER NOT NULL DEFAULT 0 CHECK (size_xgg >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  size TEXT NOT NULL CHECK (size IN ('P', 'M', 'G', 'GG', 'XG', 'XGG')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  royalty_percent DECIMAL(5,2) CHECK (royalty_percent >= 0 AND royalty_percent <= 100),
  royalty_amount DECIMAL(10,2) CHECK (royalty_amount >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (ajuste conforme necessário para seu caso)
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update products" 
ON public.products 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete products" 
ON public.products 
FOR DELETE 
USING (true);

CREATE POLICY "Anyone can view sales" 
ON public.sales 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert sales" 
ON public.sales 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update sales" 
ON public.sales 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete sales" 
ON public.sales 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_products_name ON public.products(name);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX idx_sales_product_id ON public.sales(product_id);
CREATE INDEX idx_sales_created_at ON public.sales(created_at DESC);
CREATE INDEX idx_sales_size ON public.sales(size);