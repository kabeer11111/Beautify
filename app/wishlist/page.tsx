"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, Star, Trash2 } from "lucide-react"
import { supabase, type WishlistItem } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuthAndFetchWishlist()
  }, [])

  const checkAuthAndFetchWishlist = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    setUser(user)
    await fetchWishlistItems(user.id)
  }

  const fetchWishlistItems = async (userId: string) => {
    const { data, error } = await supabase
      .from("wishlist")
      .select(`
        *,
        products (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to load wishlist items.",
        variant: "destructive",
      })
    } else {
      setWishlistItems(data || [])
    }
    setLoading(false)
  }

  const removeFromWishlist = async (itemId: number) => {
    const { error } = await supabase.from("wishlist").delete().eq("id", itemId)

    if (error) {
      toast({
        title: "Error",
        description: `Failed to remove item from wishlist: ${error.message}`,
        variant: "destructive",
      })
      console.error("Remove from wishlist error:", error)
    } else {
      setWishlistItems((items) => items.filter((item) => item.id !== itemId))
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      })
    }
  }

  const addToCart = async (productId: number) => {
    const { data: existingItem } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single()

    if (existingItem) {
      const { error } = await supabase
        .from("cart")
        .update({ quantity: existingItem.quantity + 1 })
        .eq("id", existingItem.id)

      if (error) {
        toast({
          title: "Error",
          description: `Failed to update cart: ${error.message}`,
          description: `Please update your profile details.`,
          variant: "destructive",
        })
        console.error("Add to cart from wishlist update error:", error)
      } else {
        toast({
          title: "Cart updated",
          description: "Item quantity has been updated in your cart.",
        })
      }
    } else {
      const { error } = await supabase.from("cart").insert({ user_id: user.id, product_id: productId, quantity: 1 })

      if (error) {
        toast({
          title: "Error",
          description: `Failed to add to cart: ${error.message}`,
          variant: "destructive",
        })
        console.error("Add to cart from wishlist insert error:", error)
      } else {
        toast({
          title: "Added to cart",
          description: "Item has been added to your cart.",
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved for later
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Save items you love to your wishlist and shop them later.</p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={item.products.image_url || "/placeholder.svg?height=300&width=300"}
                      alt={item.products.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Fixed badge positioning - no overlap */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {item.products.original_price && item.products.original_price > item.products.price && (
                        <Badge className="bg-red-500 hover:bg-red-600 text-white">Sale</Badge>
                      )}
                      {item.products.is_featured && (
                        <Badge className="bg-pink-500 hover:bg-pink-600 text-white">Featured</Badge>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        className="h-8 w-8 bg-pink-600 hover:bg-pink-700"
                        onClick={() => addToCart(item.products.id)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="text-sm text-muted-foreground mb-1">{item.products.brand}</p>
                    <h3 className="font-semibold mb-2 line-clamp-2 min-h-[3rem] flex items-start">
                      <Link href={`/products/${item.products.id}`} className="hover:text-pink-600">
                        {item.products.name}
                      </Link>
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(item.products.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">({item.products.review_count})</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">₹{item.products.price}</span>
                        {item.products.original_price && item.products.original_price > item.products.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{item.products.original_price}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-auto">
                      <Button className="w-full" onClick={() => addToCart(item.products.id)}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
