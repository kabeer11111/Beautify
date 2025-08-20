-- Insert sample categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Skincare', 'skincare', 'Nourish and protect your skin with our premium skincare collection', true),
('Makeup', 'makeup', 'Express your unique style with our vibrant makeup range', true),
('Fragrance', 'fragrance', 'Discover signature scents for every mood and occasion', true),
('Hair Care', 'haircare', 'Achieve healthy, beautiful hair with our professional hair care products', true),
('Body Care', 'bodycare', 'Pamper your body with luxurious care products', true);

-- Insert sample brands
INSERT INTO brands (name, slug, description, is_active) VALUES
('Beautify Essentials', 'beautify-essentials', 'Our signature line of essential beauty products', true),
('Beautify Skincare', 'beautify-skincare', 'Advanced skincare solutions for all skin types', true),
('Beautify Color', 'beautify-color', 'Vibrant makeup for every look and occasion', true),
('Beautify Hair', 'beautify-hair', 'Professional hair care for salon-quality results', true),
('Beautify Luxe', 'beautify-luxe', 'Premium luxury beauty products', true),
('Beautify Natural', 'beautify-natural', 'Natural and organic beauty solutions', true);

-- Insert sample products
INSERT INTO products (name, description, brand, category, subcategory, price, original_price, sku, stock_quantity, rating, review_count, image_url, ingredients, how_to_use, benefits, is_featured, is_active) VALUES

-- Skincare Products
('Radiance Vitamin C Serum', 'A powerful antioxidant serum that brightens skin and reduces signs of aging with 20% Vitamin C, hyaluronic acid, and vitamin E.', 'Beautify Essentials', 'skincare', 'serums', 45.99, 59.99, 'BE-VCS-001', 150, 4.8, 124, '/placeholder.svg?height=400&width=400&text=Vitamin+C+Serum', 'Water, L-Ascorbic Acid (20%), Hyaluronic Acid, Vitamin E, Ferulic Acid, Glycerin', 'Apply 2-3 drops to clean skin in the morning. Follow with moisturizer and SPF.', ARRAY['Brightens complexion', 'Reduces fine lines', 'Evens skin tone', 'Provides antioxidant protection'], true, true),

('Hydrating Rose Face Mask', 'A luxurious hydrating mask infused with rose water, hyaluronic acid, and botanical extracts for instant moisture and glow.', 'Beautify Skincare', 'skincare', 'masks', 28.99, NULL, 'BS-RFM-002', 200, 4.9, 89, '/placeholder.svg?height=400&width=400&text=Rose+Face+Mask', 'Rose Water, Hyaluronic Acid, Aloe Vera, Glycerin, Rose Extract, Vitamin B5', 'Apply a generous layer to clean skin. Leave on for 15-20 minutes, then rinse with warm water.', ARRAY['Deeply hydrates', 'Soothes irritation', 'Adds natural glow', 'Suitable for sensitive skin'], false, true),

('Anti-Aging Night Cream', 'Rich night cream with retinol, peptides, and ceramides to repair and rejuvenate skin while you sleep.', 'Beautify Luxe', 'skincare', 'moisturizers', 65.99, NULL, 'BL-ANC-003', 80, 4.9, 145, '/placeholder.svg?height=400&width=400&text=Night+Cream', 'Retinol, Peptides, Ceramides, Shea Butter, Squalane, Niacinamide', 'Apply to clean skin before bed. Use sunscreen during the day when using this product.', ARRAY['Reduces wrinkles', 'Improves skin texture', 'Boosts collagen production', 'Restores skin barrier'], true, true),

('Gentle Cleansing Oil', 'A lightweight cleansing oil that removes makeup and impurities while nourishing the skin with natural oils.', 'Beautify Natural', 'skincare', 'cleansers', 32.99, NULL, 'BN-GCO-004', 120, 4.7, 98, '/placeholder.svg?height=400&width=400&text=Cleansing+Oil', 'Jojoba Oil, Sweet Almond Oil, Vitamin E, Chamomile Extract, Lavender Oil', 'Massage onto dry skin, add water to emulsify, then rinse thoroughly.', ARRAY['Removes all makeup', 'Gentle on skin', 'Maintains moisture', 'Suitable for all skin types'], false, true),

-- Makeup Products
('Matte Liquid Lipstick Set', 'A collection of 6 long-wearing matte liquid lipsticks in trending shades that provide full coverage and comfort.', 'Beautify Color', 'makeup', 'lips', 34.99, NULL, 'BC-MLS-005', 90, 4.7, 156, '/placeholder.svg?height=400&width=400&text=Lipstick+Set', 'Dimethicone, Cyclopentasiloxane, Trimethylsiloxysilicate, Natural Waxes, Vitamin E', 'Apply directly to lips using the applicator. Allow to dry for long-lasting wear.', ARRAY['Long-lasting formula', 'Full coverage', 'Comfortable wear', '6 versatile shades'], true, true),

('Illuminating Foundation', 'A medium-coverage foundation with light-reflecting particles for a natural, radiant finish in 20 inclusive shades.', 'Beautify Color', 'makeup', 'face', 38.99, NULL, 'BC-IF-006', 200, 4.5, 203, '/placeholder.svg?height=400&width=400&text=Foundation', 'Water, Cyclopentasiloxane, Titanium Dioxide, Iron Oxides, Hyaluronic Acid, SPF 15', 'Apply with brush, sponge, or fingers. Build coverage as needed.', ARRAY['Natural radiant finish', 'Medium buildable coverage', '20 inclusive shades', 'SPF 15 protection'], false, true),

('Eyeshadow Palette - Sunset Dreams', 'A 12-shade eyeshadow palette featuring warm sunset tones in matte and shimmer finishes.', 'Beautify Color', 'makeup', 'eyes', 42.99, 52.99, 'BC-ESP-007', 75, 4.8, 187, '/placeholder.svg?height=400&width=400&text=Eyeshadow+Palette', 'Talc, Mica, Magnesium Stearate, Dimethicone, Mineral Oil, Various Pigments', 'Apply with eyeshadow brushes. Use setting spray for more intense color payoff.', ARRAY['12 versatile shades', 'Matte and shimmer finishes', 'Highly pigmented', 'Blendable formula'], true, true),

-- Hair Care Products
('Nourishing Hair Oil', 'A blend of argan, jojoba, and coconut oils that nourishes, strengthens, and adds shine to all hair types.', 'Beautify Hair', 'haircare', 'treatments', 22.99, NULL, 'BH-NHO-008', 180, 4.6, 78, '/placeholder.svg?height=400&width=400&text=Hair+Oil', 'Argan Oil, Jojoba Oil, Coconut Oil, Vitamin E, Rosemary Extract', 'Apply to damp or dry hair, focusing on mid-lengths and ends. Style as usual.', ARRAY['Adds shine', 'Reduces frizz', 'Strengthens hair', 'Suitable for all hair types'], false, true),

('Volumizing Shampoo', 'A sulfate-free shampoo that gently cleanses while adding volume and body to fine, limp hair.', 'Beautify Hair', 'haircare', 'shampoo', 24.99, NULL, 'BH-VS-009', 150, 4.7, 112, '/placeholder.svg?height=400&width=400&text=Volumizing+Shampoo', 'Water, Sodium Cocoyl Isethionate, Biotin, Keratin, Panthenol, Natural Extracts', 'Massage into wet hair, lather, and rinse thoroughly. Follow with conditioner.', ARRAY['Adds volume', 'Sulfate-free formula', 'Strengthens hair', 'Safe for color-treated hair'], false, true),

-- Fragrance Products
('Signature Eau de Parfum - Bloom', 'A feminine floral fragrance with notes of peony, rose, and white musk for an elegant, romantic scent.', 'Beautify Luxe', 'fragrance', 'womens', 68.99, NULL, 'BL-EDP-010', 60, 4.9, 134, '/placeholder.svg?height=400&width=400&text=Bloom+Perfume', 'Alcohol Denat., Fragrance, Water, Various Essential Oils', 'Spray on pulse points such as wrists, neck, and behind ears.', ARRAY['Long-lasting scent', 'Elegant floral notes', 'Perfect for day or night', '50ml bottle'], true, true),

('Fresh Citrus Body Mist', 'A refreshing body mist with energizing citrus notes of grapefruit, lemon, and bergamot.', 'Beautify Essentials', 'fragrance', 'body-mist', 18.99, NULL, 'BE-FCM-011', 220, 4.4, 67, '/placeholder.svg?height=400&width=400&text=Citrus+Mist', 'Water, Alcohol Denat., Fragrance, Citrus Extracts, Aloe Vera', 'Spray all over body for a refreshing burst of fragrance.', ARRAY['Refreshing citrus scent', 'Light and airy', 'Perfect for daily use', 'Energizing formula'], false, true),

-- Additional Popular Products
('Hyaluronic Acid Moisturizer', 'A lightweight, oil-free moisturizer that provides 24-hour hydration with hyaluronic acid and ceramides.', 'Beautify Skincare', 'skincare', 'moisturizers', 29.99, NULL, 'BS-HAM-012', 180, 4.8, 156, '/placeholder.svg?height=400&width=400&text=HA+Moisturizer', 'Hyaluronic Acid, Ceramides, Niacinamide, Glycerin, Squalane', 'Apply to clean skin morning and evening. Can be used under makeup.', ARRAY['24-hour hydration', 'Oil-free formula', 'Suitable for all skin types', 'Non-comedogenic'], true, true),

('Waterproof Mascara', 'A volumizing and lengthening waterproof mascara that withstands tears, sweat, and humidity.', 'Beautify Color', 'makeup', 'eyes', 19.99, NULL, 'BC-WM-013', 300, 4.6, 189, '/placeholder.svg?height=400&width=400&text=Waterproof+Mascara', 'Water, Beeswax, Carnauba Wax, Iron Oxides, Panthenol, Vitamin E', 'Apply from root to tip in zigzag motion. Layer for more volume.', ARRAY['Waterproof formula', 'Volumizing and lengthening', 'Long-lasting wear', 'Easy removal with oil cleanser'], false, true),

('Repair Hair Mask', 'An intensive weekly treatment mask that repairs damaged hair with keratin, proteins, and natural oils.', 'Beautify Hair', 'haircare', 'treatments', 31.99, NULL, 'BH-RHM-014', 95, 4.9, 143, '/placeholder.svg?height=400&width=400&text=Hair+Mask', 'Keratin, Hydrolyzed Proteins, Argan Oil, Shea Butter, Panthenol', 'Apply to damp hair, leave for 10-15 minutes, then rinse thoroughly.', ARRAY['Repairs damaged hair', 'Adds moisture and shine', 'Strengthens hair fiber', 'Weekly treatment'], false, true),

('Tinted Lip Balm Set', 'A set of 4 nourishing tinted lip balms in natural shades with SPF 15 protection.', 'Beautify Essentials', 'makeup', 'lips', 16.99, NULL, 'BE-TLB-015', 250, 4.5, 98, '/placeholder.svg?height=400&width=400&text=Tinted+Lip+Balm', 'Beeswax, Shea Butter, Coconut Oil, Vitamin E, SPF 15, Natural Tints', 'Apply directly to lips as needed throughout the day.', ARRAY['SPF 15 protection', '4 natural shades', 'Nourishing formula', 'Perfect for daily wear'], false, true);

-- Update product ratings based on review counts (this would normally be calculated from actual reviews)
UPDATE products SET rating = 4.8 WHERE review_count > 100;
UPDATE products SET rating = 4.7 WHERE review_count BETWEEN 80 AND 100;
UPDATE products SET rating = 4.6 WHERE review_count BETWEEN 60 AND 79;
UPDATE products SET rating = 4.5 WHERE review_count BETWEEN 40 AND 59;
UPDATE products SET rating = 4.4 WHERE review_count < 40;
