import { createClient } from "@supabase/supabase-js"

// Define the Product type based on your Supabase schema
export type Product = {
  id: number
  created_at: string
  updated_at: string
  name: string
  description: string
  brand: string
  category: string
  subcategory: string | null
  price: number
  original_price: number | null
  sku: string
  stock_quantity: number
  rating: number
  review_count: number
  image_url: string
  additional_images: string[] | null // Array of image URLs
  ingredients: string | null
  how_to_use: string | null
  benefits: string[] | null // Array of strings for benefits
  is_featured: boolean
  is_active: boolean
  sizes: string[] | null // New: Array of available sizes (e.g., "S", "M", "L", "50ml")
  product_details: string[] | null // New: Array of bullet point details
  specifications: { [key: string]: string } | null // New: JSONB for key-value specifications
}

// Define the UserProfile type
export type UserProfile = {
  id: string // UUID from auth.users
  email: string
  full_name: string | null
  avatar_url: string | null
  is_admin: boolean
  is_blacklisted: boolean
  created_at: string
  updated_at: string
}

// Define the AdminUser type
export type AdminUser = {
  id: number
  email: string
  is_active: boolean
  created_at: string
}

// Define the CartItem type
export type CartItem = {
  id: number
  user_id: string
  product_id: number
  quantity: number
  created_at: string
  // Optionally include product details for easier display
  products?: Product
}

// Define the WishlistItem type
export type WishlistItem = {
  id: number
  user_id: string
  product_id: number
  created_at: string
  // Optionally include product details for easier display
  products?: Product
}

// Define the Order type
export type Order = {
  id: number
  user_id: string
  order_number: string // New: Unique order identifier
  total_amount: number
  subtotal: number // New: Subtotal before shipping and tax
  shipping_amount: number // New: Shipping cost
  tax_amount: number // New: Tax amount
  status: "pending" | "completed" | "cancelled" | "shipped" | "delivered"
  created_at: string
  updated_at: string
  shipping_address_id: number | null
  billing_address_id: number | null
}

// Define the OrderItem type
export type OrderItem = {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price_at_purchase: number
  total_price: number // New: total price for this item (quantity * price_at_purchase)
  created_at: string
  products?: Product // Join with products table
}

// Define the Address type
export type Address = {
  id: number
  user_id: string
  type: "home" | "office" | "other" // Added type for AddressManager
  name: string // Added name for AddressManager
  street_address: string
  city: string
  state: string // Changed from state_province to state for consistency with AddressManager
  postal_code: string
  country: string
  is_default: boolean // Added is_default for AddressManager
  is_shipping: boolean // Kept for potential future use, though AddressManager uses is_default
  is_billing: boolean // Kept for potential future use, though AddressManager uses is_default
  created_at: string
}

// Update the Review type to match your database schema
export type Review = {
  id: number
  product_id: number
  user_id: string
  rating: number
  title: string | null
  comment: string | null
  created_at: string
  updated_at: string
  is_approved: boolean
  is_verified_purchase: boolean
  users?: {
    first_name: string | null
    last_name: string | null
  } // Join with users table
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
