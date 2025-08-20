"use server"

import { supabase, type CartItem } from "@/lib/supabase"

export async function confirmOrder(
  selectedAddressId: number,
  cartItems: CartItem[],
  subtotal: number,
  shipping: number,
  tax: number,
  total: number,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "User not authenticated." }
  }

  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  try {
    // 1. Create the order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        total_amount: total,
        subtotal: subtotal,
        shipping_amount: shipping,
        tax_amount: tax,
        status: "pending", // Initial status
        shipping_address_id: selectedAddressId,
        billing_address_id: selectedAddressId, // Assuming shipping and billing are the same for now
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return { success: false, message: "Failed to create order." }
    }

    // 2. Create order items
    const orderItemsToInsert = cartItems.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.products?.price || 0, // Use product's current price
      total_price: (item.products?.price || 0) * item.quantity,
    }))

    const { error: orderItemsError } = await supabase.from("order_items").insert(orderItemsToInsert)

    if (orderItemsError) {
      console.error("Error creating order items:", orderItemsError)
      // Optionally, roll back the order if order items fail
      await supabase.from("orders").delete().eq("id", orderData.id)
      return { success: false, message: "Failed to add order items." }
    }

    // 3. Clear the user's cart
    const { error: clearCartError } = await supabase.from("cart").delete().eq("user_id", user.id)

    if (clearCartError) {
      console.error("Error clearing cart:", clearCartError)
      // This is less critical, but log it
    }

    // Refresh header counts on the client side
    if (typeof window !== "undefined" && (window as any).refreshHeaderCounts) {
      ;(window as any).refreshHeaderCounts()
    }

    return { success: true, message: "Order placed successfully!", orderId: orderData.id }
  } catch (error: any) {
    console.error("Unexpected error during order confirmation:", error)
    return { success: false, message: error.message || "An unexpected error occurred." }
  }
}
