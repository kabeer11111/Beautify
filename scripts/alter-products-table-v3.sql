-- Add 'sizes' column if it doesn't exist, and set default to empty array
DO $$ BEGIN
    ALTER TABLE products ADD COLUMN sizes text[] DEFAULT '{}';
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column sizes already exists in products.';
END $$;

-- Add 'product_details' column if it doesn't exist, and set default to empty array
DO $$ BEGIN
    ALTER TABLE products ADD COLUMN product_details text[] DEFAULT '{}';
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column product_details already exists in products.';
END $$;

-- Add 'specifications' column if it doesn't exist, and set default to empty JSONB object
DO $$ BEGIN
    ALTER TABLE products ADD COLUMN specifications jsonb DEFAULT '{}'::jsonb;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column specifications already exists in products.';
END $$;

-- Ensure columns are nullable (if they were added as NOT NULL by default)
ALTER TABLE products ALTER COLUMN sizes DROP NOT NULL;
ALTER TABLE products ALTER COLUMN product_details DROP NOT NULL;
ALTER TABLE products ALTER COLUMN specifications DROP NOT NULL;
