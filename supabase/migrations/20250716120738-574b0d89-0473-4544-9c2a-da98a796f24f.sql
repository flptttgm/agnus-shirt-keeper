-- Add customer fields to sales table
ALTER TABLE public.sales 
ADD COLUMN customer_name TEXT,
ADD COLUMN customer_phone TEXT;