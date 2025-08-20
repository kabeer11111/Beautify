import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <p className="text-muted-foreground">
                  We collect information you provide directly to us, such as when you create an account, make a
                  purchase, subscribe to our newsletter, or contact us. This may include your name, email address, phone
                  number, shipping and billing addresses, and payment information.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage Information</h4>
                <p className="text-muted-foreground">
                  We automatically collect certain information about your use of our website, including your IP address,
                  browser type, operating system, referring URLs, pages viewed, and the dates/times of your visits.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cookies and Tracking Technologies</h4>
                <p className="text-muted-foreground">
                  We use cookies, web beacons, and other tracking technologies to collect information about your
                  browsing activities and to provide you with a personalized experience.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-muted-foreground">
                <li>• Process and fulfill your orders</li>
                <li>• Communicate with you about your account and orders</li>
                <li>• Send you marketing communications (with your consent)</li>
                <li>• Improve our website and services</li>
                <li>• Prevent fraud and ensure security</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your
                consent, except in the following circumstances:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Service providers who assist us in operating our website and conducting business</li>
                <li>• Payment processors to handle transactions</li>
                <li>• Shipping companies to deliver your orders</li>
                <li>• Legal requirements or to protect our rights</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no method of transmission over the internet or
                electronic storage is 100% secure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Access and update your personal information</li>
                <li>• Request deletion of your personal information</li>
                <li>• Opt-out of marketing communications</li>
                <li>• Request a copy of your personal information</li>
                <li>• Object to certain processing of your information</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 space-y-1 text-muted-foreground">
                <p>Email: privacy@beautify.com</p>
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
