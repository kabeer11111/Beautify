"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package } from "lucide-react"
import { supabase, type Order, type OrderItem, type Address } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function OrderConfirmationPage() {
  const { id } = useParams()
  const orderId = typeof id === "string" ? Number.parseInt(id, 10) : null
  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId)
    } else {
      setLoading(false)
      toast({
        title: "Invalid Order ID",
        description: "Could not find order details.",
        variant: "destructive",
      })
      router.push("/orders") // Redirect to orders page if ID is invalid
    }
  }, [orderId, router, toast])

  const fetchOrderDetails = async (id: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    // Fetch order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user owns the order
      .single()

    if (orderError || !orderData) {
      console.error("Error fetching order:", orderError)
      toast({
        title: "Error",
        description: "Failed to load order details.",
        variant: "destructive",
      })
      setLoading(false)
      router.push("/orders")
      return
    }
    setOrder(orderData)

    // Fetch order items
    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        *,
        products (name, image_url, brand)
      `)
      .eq("order_id", id)

    if (itemsError) {
      console.error("Error fetching order items:", itemsError)
      toast({
        title: "Error",
        description: "Failed to load order items.",
        variant: "destructive",
      })
    } else {
      setOrderItems(itemsData || [])
    }

    // Fetch shipping address
    if (orderData.shipping_address_id) {
      const { data: addressData, error: addressError } = await supabase
        .from("addresses")
        .select("*")
        .eq("id", orderData.shipping_address_id)
        .single()

      if (addressError) {
        console.error("Error fetching shipping address:", addressError)
      } else {
        setShippingAddress(addressData)
      }
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen text-center py-16">
        <Package className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
        <h2 className="text-2xl font-semibold mb-4">Order Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The order you are looking for does not exist or you do not have permission to view it.
        </p>
        <Button asChild>
          <Link href="/orders">View All Orders</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <CheckCircle className="h-24 w-24 mx-auto text-green-500 mb-6" />
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Your order #{order.order_number} has been placed successfully.
          </p>
          <p className="text-muted-foreground">You will receive an email confirmation shortly.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>
                  Placed on {new Date(order.created_at).toLocaleDateString()} at{" "}
                  {new Date(order.created_at).toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.products?.image_url || "/placeholder.svg?height=60&width=60"}
                        alt={item.products?.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.products?.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.products?.brand}</p>
                        <p className="text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.total_price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹{order.shipping_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{order.tax_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-2">
                    <span>Total:</span>
                    <span>₹{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Address */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                {shippingAddress ? (
                  <div className="space-y-1">
                    <p className="font-medium">{shippingAddress.name}</p>
                    <p className="text-muted-foreground">{shippingAddress.street_address}</p>
                    <p className="text-muted-foreground">
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
                    </p>
                    <p className="text-muted-foreground">{shippingAddress.country}</p>
                    <Badge variant="outline" className="mt-2 capitalize">
                      {shippingAddress.type}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Address details not available.</p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="mt-6 space-y-4">
              <Button className="w-full" asChild>
                <Link href="/orders">View My Orders</Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
