"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingBag, Star, Share2, ArrowLeft, Minus, Plus } from "lucide-react"
import { supabase, type Product, type Review } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const productId = Number.parseInt(params.id as string)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({ rating: 5, title: "", comment: "" })
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])

  // Memoized fetch functions
  const fetchProduct = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Product not found or inactive.",
        variant: "destructive",
      })
      router.push("/products")
    } else {
      setProduct(data)
      if (data?.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]) // Select first size by default
      }
    }
    setLoading(false)
  }, [productId, router, toast])

  const fetchReviews = useCallback(async () => {
    const { data, error } = await supabase
      .from("product_reviews")
      .select(
        `
      *,
      users (
        first_name,
        last_name
      )
    `,
      )
      .eq("product_id", productId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
    } else {
      setReviews(data || [])
    }
  }, [productId])

  const fetchSimilarProducts = useCallback(async () => {
    if (!product) return // Ensure product data is available

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", product.category) // Fetch from same category
      .neq("id", productId) // Exclude current product
      .eq("is_active", true)
      .limit(8) // Limit to 8 similar products
      .order("rating", { ascending: false }) // Order by rating or other criteria

    if (error) {
      console.error("Error fetching similar products:", error)
    } else {
      setSimilarProducts(data || [])
    }
  }, [product, productId])

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (productId) {
        await fetchProduct()
        await fetchReviews()
      }
    }
    fetchData()
  }, [productId, fetchProduct, fetchReviews])

  // New useEffect to check wishlist status when user or product changes
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (user && product) {
        const { data: wishlistItem } = await supabase
          .from("wishlist")
          .select("id")
          .eq("user_id", user.id)
          .eq("product_id", product.id)
          .single()
        setIsInWishlist(!!wishlistItem)
      } else {
        setIsInWishlist(false)
      }
    }
    checkWishlistStatus()
  }, [user, product]) // This effect depends on user and product

  // Fetch similar products once product data is available
  useEffect(() => {
    if (product) {
      fetchSimilarProducts()
    }
  }, [product, fetchSimilarProducts])

  const addToCart = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    if (!product) return

    const { data: existingItem } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .single()

    if (existingItem) {
      const { error } = await supabase
        .from("cart")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id)

      if (error) {
        toast({
          title: "Error",
          description: `Failed to update cart: ${error.message}`,
          variant: "destructive",
        })
        console.error("Add to cart update error:", error)
      } else {
        toast({
          title: "Cart updated",
          description: `Added ${quantity} more item(s) to your cart.`,
        })
        if (typeof window !== "undefined" && (window as any).refreshHeaderCounts) {
          ;(window as any).refreshHeaderCounts()
        }
      }
    } else {
      const { error } = await supabase.from("cart").insert({ user_id: user.id, product_id: product.id, quantity })

      if (error) {
        toast({
          title: "Error",
          description: `Failed to add to cart: ${error.message}`,
          variant: "destructive",
        })
        console.error("Add to cart insert error:", error)
      } else {
        toast({
          title: "Added to cart",
          description: `${quantity} item(s) added to your cart.`,
        })
        if (typeof window !== "undefined" && (window as any).refreshHeaderCounts) {
          ;(window as any).refreshHeaderCounts()
        }
      }
    }
  }

  const toggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist.",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    if (!product) return

    if (isInWishlist) {
      const { error } = await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", product.id)

      if (error) {
        toast({
          title: "Error",
          description: `Failed to remove from wishlist: ${error.message}`,
          variant: "destructive",
        })
        console.error("Remove from wishlist error:", error)
      } else {
        setIsInWishlist(false)
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist.",
        })
        // Add this line to refresh header counts
        if (typeof window !== "undefined" && (window as any).refreshHeaderCounts) {
          ;(window as any).refreshHeaderCounts()
        }
      }
    } else {
      const { error } = await supabase.from("wishlist").insert({ user_id: user.id, product_id: product.id })

      if (error) {
        toast({
          title: "Error",
          description: `Failed to add to wishlist: ${error.message}`,
          variant: "destructive",
        })
        console.error("Add to wishlist error:", error)
      } else {
        setIsInWishlist(true)
        toast({
          title: "Added to wishlist",
          description: "Item has been added to your wishlist.",
        })
        // Add this line to refresh header counts
        if (typeof window !== "undefined" && (window as any).refreshHeaderCounts) {
          ;(window as any).refreshHeaderCounts()
        }
      }
    }
  }

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a review.",
        variant: "destructive",
      })
      return
    }

    if (!newReview.comment.trim()) {
      toast({
        title: "Review required",
        description: "Please write a review before submitting.",
        variant: "destructive",
      })
      return
    }

    setSubmittingReview(true)

    try {
      const { error } = await supabase.from("product_reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating: newReview.rating,
        title: newReview.title.trim(),
        comment: newReview.comment.trim(),
        is_approved: true, // Auto-approve reviews so they show immediately
      })

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Review already exists",
            description: "You have already reviewed this product.",
            variant: "destructive",
          })
        } else {
          throw error // Re-throw other errors
        }
      } else {
        toast({
          title: "Review submitted",
          description: "Thank you for your review!",
        })
        setNewReview({ rating: 5, title: "", comment: "" })
        await fetchReviews() // Re-fetch reviews to update list

        // Update product rating
        const newRating = (product!.rating * product!.review_count + newReview.rating) / (product!.review_count + 1)
        await supabase
          .from("products")
          .update({
            rating: Number.parseFloat(newRating.toFixed(1)), // Round to 1 decimal place
            review_count: product!.review_count + 1,
          })
          .eq("id", productId)
        await fetchProduct() // Re-fetch product to update rating display
      }
    } catch (error: any) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product!.name,
          text: product!.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link has been copied to your clipboard.",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  const images = [product.image_url, ...(product.additional_images || [])].filter(Boolean)
  const discountPercentage =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0

  // Calculate review distribution
  const reviewDistribution = Array(5).fill(0)
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      reviewDistribution[review.rating - 1]++
    }
  })

  return (
    <div className="min-h-screen py-4 md:py-8 overflow-auto">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4 md:mb-6">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.toLowerCase()}`} className="hover:text-foreground">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate">{product.name}</span>
        </div>

        <Button variant="ghost" onClick={() => router.back()} className="mb-4 md:mb-6 -ml-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={images[selectedImage] || "/placeholder.svg?height=500&width=500"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-pink-500" : "border-transparent"
                    }`}
                  >
                    <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-2">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">({product.review_count} reviews)</span>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl md:text-3xl font-bold">₹{product.price}</span>
                {product.original_price && product.original_price > product.price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">₹{product.original_price}</span>
                    <Badge variant="destructive">{discountPercentage}% OFF</Badge>
                  </>
                )}
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <Label htmlFor="size" className="block mb-2">
                    SELECT SIZE{" "}
                    <Link href="#" className="text-pink-600 text-sm ml-2">
                      SIZE CHART
                    </Link>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => setSelectedSize(size)}
                        className={selectedSize === size ? "bg-pink-600 hover:bg-pink-700 text-white" : ""}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Actions */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="quantity">Quantity:</Label>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      disabled={quantity >= product.stock_quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button onClick={addToCart} className="flex-1" disabled={product.stock_quantity === 0}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={toggleWishlist}
                    className={isInWishlist ? "text-pink-600 border-pink-600 bg-pink-50 hover:bg-pink-100" : ""}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current text-pink-600" : ""}`} />
                  </Button>
                  <Button variant="outline" onClick={shareProduct}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Delivery Options (Placeholder) */}
              <div className="space-y-2 mb-6">
                <h3 className="font-semibold">DELIVERY OPTIONS</h3>
                <div className="flex gap-2">
                  <Input placeholder="Enter pincode" className="flex-1" />
                  <Button variant="outline">Check</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Please enter PIN code to check delivery time & Pay on Delivery Availability
                </p>
              </div>

              {/* Product Features */}
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <p>100% Original Products</p>
                <p>Pay on delivery might be available</p>
                <p>Easy 14 days returns and exchanges</p>
              </div>

              {/* Best Offers (Placeholder) */}
              <div className="space-y-2 mb-6">
                <h3 className="font-semibold">BEST OFFERS</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Applicable on Orders above ₹700 (only on first purchase)</li>
                  <li>Coupon code: BEAUTIFY500</li>
                  <li>Coupon Discount 25% off (Your total saving ₹1399)</li>
                  <li>
                    <Link href="#" className="text-pink-600">
                      View Eligible Products
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 md:mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description || "No description available."}
                  </p>
                  {product.product_details && product.product_details.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">PRODUCT DETAILS</h3>
                      <ul className="list-disc list-inside text-muted-foreground">
                        {product.product_details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Specifications</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <React.Fragment key={key}>
                            <span className="font-medium capitalize">{key.replace(/_/g, " ")}</span>
                            <span>{value}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.ingredients || "Ingredient information not available."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="how-to-use" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>How to Use</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.how_to_use || "Usage instructions not available."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Review Summary / Distribution */}
                {reviews.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Ratings & Reviews Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Average Rating */}
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-5xl font-bold text-pink-600">{product.rating.toFixed(1)}</span>
                          <div className="flex items-center mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-6 w-6 ${
                                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-muted-foreground mt-1">{product.review_count} Verified Buyers</span>
                        </div>

                        {/* Distribution Bars */}
                        <div className="space-y-2">
                          {reviewDistribution
                            .slice()
                            .reverse()
                            .map((count, index) => {
                              const star = 5 - index
                              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                              return (
                                <div key={star} className="flex items-center gap-2">
                                  <span className="text-sm font-medium w-8 text-right">
                                    {star} <Star className="inline-block h-3 w-3 fill-current text-yellow-400" />
                                  </span>
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-pink-600 h-full rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-muted-foreground w-10 text-right">{count}</span>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Write Review */}
                {user && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Write a Review</CardTitle>
                      <CardDescription>Share your experience with this product</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <Select
                          value={newReview.rating.toString()}
                          onValueChange={(value) => setNewReview({ ...newReview, rating: Number.parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 Stars - Excellent</SelectItem>
                            <SelectItem value="4">4 Stars - Very Good</SelectItem>
                            <SelectItem value="3">3 Stars - Good</SelectItem>
                            <SelectItem value="2">2 Stars - Fair</SelectItem>
                            <SelectItem value="1">1 Star - Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="title">Review Title (Optional)</Label>
                        <Input
                          id="title"
                          placeholder="Summarize your review"
                          value={newReview.title}
                          onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="comment">Your Review</Label>
                        <Textarea
                          id="comment"
                          placeholder="Tell others about your experience with this product"
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          rows={4}
                        />
                      </div>
                      <Button onClick={submitReview} disabled={submittingReview}>
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarFallback>
                                {review.users?.first_name?.[0] || review.users?.last_name?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-semibold">
                                  {review.users?.first_name && review.users?.last_name
                                    ? `${review.users.first_name} ${review.users.last_name}`
                                    : review.users?.first_name || review.users?.last_name || "Anonymous"}
                                </span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              {review.title && <h4 className="font-semibold mb-2">{review.title}</h4>}
                              <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12 md:mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="block">
                  <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={product.image_url || "/placeholder.svg?height=300&width=300"}
                          alt={product.name}
                          className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
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
                            className="h-8 w-8 bg-white/90 hover:bg-white"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              // For similar products, we'll just use the basic add to wishlist without tracking state
                              // since this is a detail page focused on the main product
                              if (!user) {
                                toast({
                                  title: "Sign in required",
                                  description: "Please sign in to add items to your wishlist.",
                                  variant: "destructive",
                                })
                                return
                              }

                              supabase
                                .from("wishlist")
                                .insert({ user_id: user.id, product_id: product.id })
                                .then(({ error }) => {
                                  if (error && error.code !== "23505") {
                                    toast({
                                      title: "Error",
                                      description: `Failed to add to wishlist: ${error.message}`,
                                      variant: "destructive",
                                    })
                                  } else {
                                    toast({
                                      title: "Added to wishlist",
                                      description: "Item has been added to your wishlist.",
                                    })
                                  }
                                })
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            className="h-8 w-8 bg-pink-600 hover:bg-pink-700"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              addToCart()
                            }}
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
                          <span className="text-xs md:text-sm text-muted-foreground ml-2">
                            ({product.review_count})
                          </span>
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
          </div>
        )}
      </div>
    </div>
  )
}
