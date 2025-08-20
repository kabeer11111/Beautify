-- Ensure the 'cart' table has a foreign key to 'auth.users'
ALTER TABLE public.cart
ADD CONSTRAINT cart_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

-- Ensure the 'wishlist' table has a foreign key to 'auth.users'
ALTER TABLE public.wishlist
ADD CONSTRAINT wishlist_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

-- Enable Row Level Security for 'cart' table
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to SELECT their own cart items
DROP POLICY IF EXISTS "Users can view their own cart items." ON public.cart;
CREATE POLICY "Users can view their own cart items." ON public.cart
FOR SELECT USING (auth.uid() = user_id);

-- Policy for authenticated users to INSERT into their own cart
DROP POLICY IF EXISTS "Users can insert into their own cart." ON public.cart;
CREATE POLICY "Users can insert into their own cart." ON public.cart
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to UPDATE their own cart items
DROP POLICY IF EXISTS "Users can update their own cart items." ON public.cart;
CREATE POLICY "Users can update their own cart items." ON public.cart
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to DELETE their own cart items
DROP POLICY IF EXISTS "Users can delete their own cart items." ON public.cart;
CREATE POLICY "Users can delete their own cart items." ON public.cart
FOR DELETE USING (auth.uid() = user_id);

-- Enable Row Level Security for 'wishlist' table
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to SELECT their own wishlist items
DROP POLICY IF EXISTS "Users can view their own wishlist items." ON public.wishlist;
CREATE POLICY "Users can view their own wishlist items." ON public.wishlist
FOR SELECT USING (auth.uid() = user_id);

-- Policy for authenticated users to INSERT into their own wishlist
DROP POLICY IF EXISTS "Users can insert into their own wishlist." ON public.wishlist;
CREATE POLICY "Users can insert into their own wishlist." ON public.wishlist
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to DELETE their own wishlist items
DROP POLICY IF EXISTS "Users can delete their own wishlist items." ON public.wishlist;
CREATE POLICY "Users can delete their own wishlist items." ON public.wishlist
FOR DELETE USING (auth.uid() = user_id);

-- Optional: If you have a 'profiles' table and user_id in cart/wishlist references profiles.id
-- You might need to adjust the foreign key to reference profiles.id instead of auth.users.id
-- and ensure RLS on profiles table allows access.
-- For example, if user_id in cart/wishlist references public.profiles(id):
-- ALTER TABLE public.cart DROP CONSTRAINT IF EXISTS cart_user_id_fkey;
-- ALTER TABLE public.cart ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON DELETE CASCADE;
-- ALTER TABLE public.wishlist DROP CONSTRAINT IF EXISTS wishlist_user_id_fkey;
-- ALTER TABLE public.wishlist ADD CONSTRAINT wishlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON DELETE CASCADE;
