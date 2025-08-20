"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { supabase, type CartItem } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [updating, setUpdating] = useState<number | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuthAndFetchCart()
  }, [])

  const checkAuthAndFetchCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    setUser(user)
    await fetchCartItems(user.id)
  }

  const fetchCartItems = async (userId: string) => {
    const { data, error } = await supabase
      .from("cart")
      .select(`
        *,
        products (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching cart:", error)
      toast({
        title: "Error",
        description: "Failed to load cart items.",
        variant: "destructive",
      })
    } else {
      setCartItems(data || [])
    }
    setLoading(false)
  }

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdating(itemId)
    const { error } = await supabase.from("cart").update({ quantity: newQuantity }).eq("id", itemId)

    if (error) {
      toast({
        title: "Error",
        description: `Failed to update quantity: ${error.message}`,
        variant: "destructive",
      })
      console.error("Update quantity error:", error)
    } else {
      setCartItems((items) => items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
      if (typeof window !== "undefined" && (window as any).refreshHeaderCounts) {
        ;(window as any).refreshHeaderCounts()
      }
    }
    setUpdating(null)
  }

  const removeItem = async (itemId: number) => {
    const { error } = await supabase.from("cart").delete().eq("id", itemId)

    if (error) {
      toast({
        title: "Error",
        description: `Failed to remove item: ${error.message}`,
        variant: "destructive",
      })
      console.error("Remove item error:", error)
    } else {
      setCartItems((items) => items.filter((item) => item.id !== itemId))
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      })
      if (typeof window !== "undefined" && (window as any).refreshHeaderCounts) {
        ;(window as any).refreshHeaderCounts()
      }
    }
  }

  const clearCart = async () => {
    const { error } = await supabase.from("cart").delete().eq("user_id", user.id)

    if (error) {
      toast({
        title: "Error",
        description: `Failed to clear cart: ${error.message}`,
        variant: "destructive",
      })
      console.error("Clear cart error:", error)
    } else {
      setCartItems([])
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      })
      if (typeof window !== "undefined" && (window as any).refreshHeaderCounts) {
        ;(window as any).refreshHeaderCounts()
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

  const subtotal = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <img
                        src={item.products.image_url || "/placeholder.svg?height=100&width=100"}
                        alt={item.products.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          <Link href={`/products/${item.products.id}`} className="hover:text-pink-600">
                            {item.products.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground">{item.products.brand}</p>
                        <p className="font-semibold mt-1">₹{item.products.price}</p>
                      </div>
                      <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updating === item.id}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right mt-4 sm:mt-0">
                        <p className="font-semibold">₹{(item.products.price * item.quantity).toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping === 0 && (
                    <Badge variant="secondary" className="w-full justify-center">
                      Free shipping on orders over ₹50!
                    </Badge>
                  )}
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
