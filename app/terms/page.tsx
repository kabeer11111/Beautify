import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing and using the Beautify website and services, you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by the above, please do not use this
                service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Permission is granted to temporarily download one copy of the materials on Beautify's website for
                personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of
                title, and under this license you may not:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Modify or copy the materials</li>
                <li>• Use the materials for any commercial purpose or for any public display</li>
                <li>• Attempt to reverse engineer any software contained on the website</li>
                <li>• Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We strive to provide accurate product information, including descriptions, prices, and availability.
                However, we do not warrant that product descriptions or other content is accurate, complete, reliable,
                current, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions and to
                change or update information at any time without prior notice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing and Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-muted-foreground">
                <li>• All prices are subject to change without notice</li>
                <li>• Payment is due at the time of purchase</li>
                <li>• We accept major credit cards, PayPal, and other approved payment methods</li>
                <li>• You are responsible for all charges incurred under your account</li>
                <li>• We reserve the right to refuse or cancel orders at our discretion</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping and Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Shipping times are estimates and not guaranteed. We are not responsible for delays caused by shipping
                carriers, customs, or other factors beyond our control. Risk of loss and title for items purchased pass
                to you upon delivery to the carrier.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Returns and Refunds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Please refer to our Returns & Exchanges policy for detailed information about returns, exchanges, and
                refunds. All returns must comply with our return policy to be eligible for refund or exchange.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                When you create an account with us, you must provide information that is accurate, complete, and current
                at all times. You are responsible for safeguarding the password and for all activities that occur under
                your account.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• You must be at least 18 years old to create an account</li>
                <li>• One account per person</li>
                <li>• You are responsible for maintaining account security</li>
                <li>• We reserve the right to terminate accounts that violate our terms</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prohibited Uses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">You may not use our service:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>
                  • To violate any international, federal, provincial, or state regulations, rules, laws, or local
                  ordinances
                </li>
                <li>
                  • To infringe upon or violate our intellectual property rights or the intellectual property rights of
                  others
                </li>
                <li>• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>• To submit false or misleading information</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                In no case shall Beautify, our directors, officers, employees, affiliates, agents, contractors, interns,
                suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct,
                indirect, incidental, punitive, special, or consequential damages of any kind.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Questions about the Terms of Service should be sent to us at:</p>
              <div className="mt-4 space-y-1 text-muted-foreground">
                <p>Email: legal@beautify.com</p>
                <p>Phone: 1-555-BEAUTIFY</p>
                <p>Address: 123 Beauty Boulevard, New York, NY 10001</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
