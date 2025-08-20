"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingBag } from "lucide-react"
import { supabase, type Product } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()
  const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    const fetchInitialData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      await fetchFeaturedProducts()
      if (user) {
        await fetchWishlistItems()
      }
    }
    fetchInitialData()
  }, [])

  const fetchFeaturedProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8)

    if (error) {
      console.error("Error fetching featured products:", error)
      toast({
        title: "Error",
        description: "Failed to load featured products.",
        variant: "destructive",
      })
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  const fetchWishlistItems = async () => {
    if (!user) {
      setWishlistItems(new Set())
      return
    }

    const { data, error } = await supabase.from("wishlist").select("product_id").eq("user_id", user.id)

    if (error) {
      console.error("Error fetching wishlist:", error)
    } else {
      const productIds = new Set(data?.map((item) => item.product_id) || [])
      setWishlistItems(productIds)
    }
  }

  useEffect(() => {
    if (user) {
      fetchWishlistItems()
    } else {
      setWishlistItems(new Set())
    }
  }, [user])

  const addToWishlist = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist.",
        variant: "destructive",
      })
      return
    }

    const isInWishlist = wishlistItems.has(productId)

    if (isInWishlist) {
      // Remove from wishlist
      const { error } = await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", productId)

      if (error) {
        toast({
          title: "Error",
          description: `Failed to remove from wishlist: ${error.message}`,
          variant: "destructive",
        })
        console.error("Wishlist remove error:", error)
      } else {
        setWishlistItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(productId)
          return newSet
        })
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist.",
        })
        if (typeof window !== "undefined" && (window as any).refreshHeaderCounts) {
          ;(window as any).refreshHeaderCounts()
        }
      }
    } else {
      // Add to wishlist
      const { error } = await supabase.from("wishlist").insert({ user_id: user.id, product_id: productId })

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already in wishlist",
            description: "This item is already in your wishlist.",
          })
        } else {
          toast({
            title: "Error",
            description: `Failed to add to wishlist: ${error.message}`,
            variant: "destructive",
          })
          console.error("Wishlist add error:", error)
        }
      } else {
        setWishlistItems((prev) => new Set([...prev, productId]))
        toast({
          title: "Added to wishlist",
          description: "Item has been added to your wishlist.",
        })
        if (typeof window !== "undefined" && (window as any).refreshHeaderCounts) {
          ;(window as any).refreshHeaderCounts()
        }
      }
    }
  }

  const addToCart = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      })
      return
    }

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
          variant: "destructive",
        })
        console.error("Cart update error:", error)
      } else {
        toast({
          title: "Cart updated",
          description: "Item quantity has been updated in your cart.",
        })
        if (typeof window !== "undefined" && (window as any).refreshHeaderCounts) {
          ;(window as any).refreshHeaderCounts()
        }
      }
    } else {
      const { error } = await supabase.from("cart").insert({ user_id: user.id, product_id: productId, quantity: 1 })

      if (error) {
        toast({
          title: "Error",
          description: `Failed to add to cart: ${error.message}`,
          variant: "destructive",
        })
        console.error("Cart add error:", error)
      } else {
        toast({
          title: "Added to cart",
          description: "Item has been added to your cart.",
        })
        if (typeof window !== "undefined" && (window as any).refreshHeaderCounts) {
          ;(window as any).refreshHeaderCounts()
        }
      }
    }
  }

  if (loading) {
    return (
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Products</h2>
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="block">
                <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="relative overflow-hidden rounded-t-lg aspect-square min-h-[200px]">
                      <img
                        src={product.image_url || "/placeholder.svg?height=300&width=300"}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.original_price && product.original_price > product.price && (
                          <Badge className="bg-red-500 hover:bg-red-600 text-white">Sale</Badge>
                        )}
                        {product.is_featured && (
                          <Badge className="bg-pink-500 hover:bg-pink-600 text-white">Featured</Badge>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    

                        <Button
                          size="icon"
                          variant="secondary"
                          className={`h-8 w-8 ${
                            wishlistItems.has(product.id)
                              ? "bg-pink-100 hover:bg-pink-200"
                              : "bg-white/90 hover:bg-white border border-gray-300"
                          }`}
                          onClick={(e) => addToWishlist(e, product.id)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              wishlistItems.has(product.id)
                                ? "text-pink-600 fill-current"
                                : "text-gray-500 stroke-2"
                            }`}
                          />
                        </Button>

                      </div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          className="h-8 w-8 bg-pink-600 hover:bg-pink-700"
                          onClick={(e) => addToCart(e, product.id)}
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 md:p-4 flex-1 flex flex-col">
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">{product.brand}</p>
                      <h3 className="font-semibold mb-2 line-clamp-2 text-sm md:text-base group-hover:text-pink-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 md:h-4 md:w-4 ${
                                i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs md:text-sm text-muted-foreground ml-2">({product.review_count})</span>
                      </div>
                      <div className="mt-auto">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-base md:text-lg">₹{product.price}</span>
                          {product.original_price && product.original_price > product.price && (
                            <span className="text-xs md:text-sm text-muted-foreground line-through">
                              ₹{product.original_price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
