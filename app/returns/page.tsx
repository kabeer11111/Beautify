import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Package, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Returns & Exchanges</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We want you to love your Beautify products. If you're not completely satisfied, we're here to help with our
            hassle-free return policy.
          </p>
        </div>

        {/* Return Policy Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Clock className="h-12 w-12 mx-auto text-pink-600 mb-4" />
              <CardTitle>30-Day Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Unopened products can be returned within 30 days of delivery</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <RotateCcw className="h-12 w-12 mx-auto text-pink-600 mb-4" />
              <CardTitle>Easy Exchanges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Exchange for different size, color, or product of equal value</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Package className="h-12 w-12 mx-auto text-pink-600 mb-4" />
              <CardTitle>Free Return Shipping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">We provide prepaid return labels for all domestic returns</p>
            </CardContent>
          </Card>
        </div>

        {/* Return Conditions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Return Conditions</CardTitle>
            <CardDescription>
              To ensure the safety and quality of our products, please review our return conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Returnable Items
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Unopened products in original packaging</li>
                  <li>• Items with original seals intact</li>
                  <li>• Products within 30 days of delivery</li>
                  <li>• Items with original receipt or order number</li>
                  <li>• Opened products within 14 days (satisfaction guarantee)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-red-600">Non-Returnable Items</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Opened products after 14 days</li>
                  <li>• Products without original packaging</li>
                  <li>• Items damaged by misuse</li>
                  <li>• Gift cards and digital products</li>
                  <li>• Final sale or clearance items</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Return */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Return Items</CardTitle>
            <CardDescription>Follow these simple steps to return your items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Initiate Return</h4>
                  <p className="text-muted-foreground">
                    Log into your account and select "Return Items" from your order history, or contact our customer
                    service team.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Print Return Label</h4>
                  <p className="text-muted-foreground">
                    We'll email you a prepaid return shipping label. Print it and attach it to your package.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Package Items</h4>
                  <p className="text-muted-foreground">
                    Securely package your items in the original packaging if possible, or use a suitable box.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ship Your Return</h4>
                  <p className="text-muted-foreground">
                    Drop off your package at any authorized shipping location or schedule a pickup.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Please allow 3-5 business days for us to process your return once we receive it.
                You'll receive an email confirmation when your refund has been processed.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Refund Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Refund Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Processing Time</h4>
                <p className="text-sm text-muted-foreground">
                  Refunds are processed within 3-5 business days after we receive your returned items.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Refund Method</h4>
                <p className="text-sm text-muted-foreground">
                  Refunds will be credited to your original payment method. Credit card refunds may take 5-10 business
                  days to appear on your statement.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Partial Refunds</h4>
                <p className="text-sm text-muted-foreground">
                  If items are returned in used condition or without original packaging, a partial refund may apply.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exchange Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Same Value Exchanges</h4>
                <p className="text-sm text-muted-foreground">
                  Exchange for a different size, color, or product of equal value at no additional cost.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Price Difference</h4>
                <p className="text-sm text-muted-foreground">
                  If the new item costs more, you'll pay the difference. If it costs less, we'll refund the difference.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Exchange Shipping</h4>
                <p className="text-sm text-muted-foreground">
                  We'll send your exchange item as soon as we receive your return. Standard shipping applies.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* International Returns */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>International Returns</CardTitle>
            <CardDescription>Special considerations for customers outside the United States</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Return Shipping</h4>
                <p className="text-muted-foreground">
                  International customers are responsible for return shipping costs. We recommend using a trackable
                  shipping method.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Customs and Duties</h4>
                <p className="text-muted-foreground">
                  Any customs duties or taxes paid on the original order cannot be refunded. New duties may apply to
                  exchange items.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Processing Time</h4>
                <p className="text-muted-foreground">
                  International returns may take longer to process due to customs clearance. Please allow 2-3 additional
                  weeks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact and Support */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help with Your Return?</CardTitle>
            <CardDescription>
              Our customer service team is here to assist you with any questions about returns or exchanges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Contact Options</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong> returns@beautify.com
                  </p>
                  <p>
                    <strong>Phone:</strong> 1-555-BEAUTIFY (1-555-232-8849)
                  </p>
                  <p>
                    <strong>Live Chat:</strong> Available 9 AM - 6 PM EST
                  </p>
                  <p>
                    <strong>Response Time:</strong> Within 24 hours
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Quick Actions</h4>
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/orders">View My Orders</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
