-- Add new columns to the products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS sizes TEXT[],
ADD COLUMN IF NOT EXISTS product_details TEXT[],
ADD COLUMN IF NOT EXISTS specifications JSONB;

-- Optional: Add default values if you want existing rows to have non-null values for new columns
-- ALTER TABLE products ALTER COLUMN sizes SET DEFAULT '{}';
-- ALTER TABLE products ALTER COLUMN product_details SET DEFAULT '{}';
-- ALTER TABLE products ALTER COLUMN specifications SET DEFAULT '{}'::jsonb;

-- Note: If you have existing data, you might need to run an UPDATE statement
-- to populate these new columns with appropriate data, or ensure your application
-- handles null values gracefully until data is added.
