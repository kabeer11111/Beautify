"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { MapPin, CheckCircle, Loader2 } from "lucide-react"
import { supabase, type CartItem, type Address } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { AddressManager } from "@/components/address-manager"
import { confirmOrder } from "@/actions/order"
import { ShoppingBag } from "lucide-react" // Import ShoppingBag

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuthAndFetchData()
  }, [])

  const checkAuthAndFetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    setUser(user)
    await Promise.all([fetchCartItems(user.id), fetchAddresses(user.id)])
    setLoading(false)
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
  }

  const fetchAddresses = async (userId: string) => {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })

    if (error) {
      console.error("Error fetching addresses:", error)
      toast({
        title: "Error",
        description: "Failed to load addresses.",
        variant: "destructive",
      })
    } else {
      setAddresses(data || [])
      // Set default address if available
      const defaultAddress = data?.find((addr) => addr.is_default)
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id)
      } else if (data && data.length > 0) {
        // If no default, select the first one
        setSelectedAddressId(data[0].id)
      }
    }
  }

  const handleConfirmOrder = async () => {
    if (!selectedAddressId) {
      toast({
        title: "Address Required",
        description: "Please select a delivery address.",
        variant: "destructive",
      })
      return
    }
    if (cartItems.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your cart is empty. Please add items before checking out.",
        variant: "destructive",
      })
      router.push("/products")
      return
    }

    setIsConfirmingOrder(true)
    const result = await confirmOrder(selectedAddressId, cartItems, subtotal, shipping, tax, total)
    setIsConfirmingOrder(false)

    if (result.success) {
      toast({
        title: "Order Confirmed!",
        description: result.message,
      })
      router.push(`/order-confirmation/${result.orderId}`)
    } else {
      toast({
        title: "Order Failed",
        description: result.message || "There was an error confirming your order.",
        variant: "destructive",
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

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen text-center py-16">
        <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
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
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Delivery Address Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Select Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No addresses saved. Please add a new address below.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {addresses.map((address) => (
                      <Card
                        key={address.id}
                        className={`cursor-pointer ${
                          selectedAddressId === address.id ? "border-pink-600 ring-2 ring-pink-600" : ""
                        }`}
                        onClick={() => setSelectedAddressId(address.id)}
                      >
                        <CardContent className="p-4 flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium capitalize">{address.name}</span>
                              <Badge
                                variant={
                                  address.type === "home"
                                    ? "default"
                                    : address.type === "office"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {address.type}
                              </Badge>
                              {address.is_default && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {address.street_address}
                              <br />
                              {address.city}, {address.state} {address.postal_code}
                              <br />
                              {address.country}
                            </p>
                          </div>
                          {selectedAddressId === address.id && <CheckCircle className="h-5 w-5 text-pink-600 ml-4" />}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                <Separator />
                <h3 className="text-lg font-semibold">Manage Addresses</h3>
                {/* AddressManager handles adding/editing/deleting addresses */}
                <AddressManager />
              </CardContent>
            </Card>

            {/* Order Items Review */}
            <Card>
              <CardHeader>
                <CardTitle>2. Review Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.products.image_url || "/placeholder.svg?height=60&width=60"}
                      alt={item.products.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.products.name}</h3>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.products.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Payment */}
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
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleConfirmOrder}
                  disabled={!selectedAddressId || isConfirmingOrder || cartItems.length === 0}
                >
                  {isConfirmingOrder ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...
                    </>
                  ) : (
                    "Confirm Order"
                  )}
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/cart">Back to Cart</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
