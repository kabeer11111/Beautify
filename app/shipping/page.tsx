import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, MapPin, Package } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn about our shipping options, delivery times, and policies to ensure your beauty products arrive safely
            and on time.
          </p>
        </div>

        {/* Shipping Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Truck className="h-12 w-12 mx-auto text-pink-600 mb-4" />
              <CardTitle>Standard Shipping</CardTitle>
              <CardDescription>3-5 business days</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold mb-2">$5.99</p>
              <Badge variant="secondary">FREE on orders $50+</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 mx-auto text-pink-600 mb-4" />
              <CardTitle>Express Shipping</CardTitle>
              <CardDescription>1-2 business days</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold mb-2">$12.99</p>
              <Badge variant="outline">All orders</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Package className="h-12 w-12 mx-auto text-pink-600 mb-4" />
              <CardTitle>Overnight Shipping</CardTitle>
              <CardDescription>Next business day</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold mb-2">$24.99</p>
              <Badge variant="outline">Order by 2 PM</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Zones */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Shipping Zones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Domestic Shipping (United States)</h4>
                <p className="text-muted-foreground mb-4">
                  We ship to all 50 states, including Alaska and Hawaii. APO/FPO addresses are also supported.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium">Continental US</h5>
                    <p className="text-sm text-muted-foreground">Standard delivery times apply</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Alaska & Hawaii</h5>
                    <p className="text-sm text-muted-foreground">Add 1-2 additional business days</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">International Shipping</h4>
                <p className="text-muted-foreground mb-4">
                  We ship to over 50 countries worldwide. International shipping times vary by destination.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-medium">Canada</h5>
                    <p className="text-sm text-muted-foreground">5-10 business days</p>
                    <p className="text-sm font-medium">Starting at $15.99</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Europe</h5>
                    <p className="text-sm text-muted-foreground">7-14 business days</p>
                    <p className="text-sm font-medium">Starting at $19.99</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Rest of World</h5>
                    <p className="text-sm text-muted-foreground">10-21 business days</p>
                    <p className="text-sm font-medium">Starting at $24.99</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Policies */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Processing Time</h4>
                <p className="text-sm text-muted-foreground">
                  Orders are typically processed within 1-2 business days. During peak seasons or sales events,
                  processing may take up to 3 business days.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Order Cutoff</h4>
                <p className="text-sm text-muted-foreground">
                  Orders placed before 2:00 PM EST on business days will be processed the same day. Orders placed after
                  2:00 PM or on weekends will be processed the next business day.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Business Days</h4>
                <p className="text-sm text-muted-foreground">
                  Monday through Friday, excluding federal holidays. We do not process or ship orders on weekends or
                  holidays.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Once your order ships, you'll receive a tracking number via email. You can also track your order by
                  logging into your account.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Delivery Attempts</h4>
                <p className="text-sm text-muted-foreground">
                  Our carriers will attempt delivery up to 3 times. If delivery is unsuccessful, the package will be
                  held at the local facility for pickup.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Signature Required</h4>
                <p className="text-sm text-muted-foreground">
                  Orders over $150 require a signature upon delivery for security purposes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Special Considerations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Special Considerations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Temperature-Sensitive Products</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Some beauty products may be sensitive to extreme temperatures. During summer months, we may:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use insulated packaging</li>
                  <li>• Ship via expedited methods</li>
                  <li>• Hold shipments during extreme weather</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">International Orders</h4>
                <p className="text-sm text-muted-foreground mb-2">International customers are responsible for:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Customs duties and taxes</li>
                  <li>• Import restrictions compliance</li>
                  <li>• Address accuracy in local format</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Have questions about shipping? Our customer service team is here to help.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <h4 className="font-semibold mb-2">Email Support</h4>
                <p className="text-sm text-muted-foreground">shipping@beautify.com</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2">Phone Support</h4>
                <p className="text-sm text-muted-foreground">1-555-BEAUTIFY</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2">Live Chat</h4>
                <p className="text-sm text-muted-foreground">Available 9 AM - 6 PM EST</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
