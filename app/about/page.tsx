import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Leaf, Shield, Truck } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Beautify</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              We believe that beauty comes from within, and our mission is to help you enhance your natural radiance
              with premium, ethically-sourced beauty products.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020, Beautify was born from a simple belief: everyone deserves access to high-quality,
                  ethically-made beauty products that celebrate their unique beauty.
                </p>
                <p>
                  Our journey began when our founder, frustrated with the lack of transparency in the beauty industry,
                  decided to create a brand that prioritizes both effectiveness and ethics.
                </p>
                <p>
                  Today, we're proud to offer a curated collection of premium beauty products that are cruelty-free,
                  sustainably sourced, and designed to help you look and feel your best.
                </p>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1629380108599-ea06489d66f5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fGJlYXV0eSUyMHByb2R1Y3RzfGVufDB8fDB8fHww" alt="Our Story" className="rounded-2xl shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do, from product selection to customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="font-semibold mb-2">Cruelty-Free</h3>
                <p className="text-sm text-muted-foreground">
                  We never test on animals and only partner with brands that share our commitment to cruelty-free
                  practices.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Natural Ingredients</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritize products made with natural, sustainably-sourced ingredients that are gentle on your
                  skin.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Quality Assured</h3>
                <p className="text-sm text-muted-foreground">
                  Every product is carefully tested and vetted to ensure it meets our high standards for quality and
                  safety.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Fast & Free Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  Enjoy free shipping on all orders over $50, with fast and reliable delivery to your doorstep.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our passionate team is dedicated to helping you discover products that make you feel confident and
              beautiful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Founder & CEO",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Beauty industry veteran with 15+ years of experience in product development and brand management.",
              },
              {
                name: "Emily Chen",
                role: "Head of Product",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Cosmetic chemist passionate about creating innovative, safe, and effective beauty formulations.",
              },
              {
                name: "Michael Rodriguez",
                role: "Customer Experience Director",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Dedicated to ensuring every customer has an exceptional experience with our brand and products.",
              },
            ].map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">
                    {member.role}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Certifications</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're proud to be certified by leading organizations that share our commitment to ethical beauty.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <img src="https://cdn2.iconfinder.com/data/icons/flat-green-organic-natural-badges/500/Cruelty-free-2-512.png" alt="Cruelty Free Certified" className="h-16" />
            <img src="https://png.pngtree.com/png-clipart/20230801/original/pngtree-certified-organic-food-or-product-label-farm-healthy-print-vector-picture-image_9219101.png" alt="Organic Certified" className="h-16" />
            <img src="https://americanveg.org/wp-content/uploads/AVA-vegetarian-color.png" alt="Vegan Society" className="h-16" />
          
            <img src="https://png.pngtree.com/png-clipart/20221028/original/pngtree-sustainable-packaging-badge-png-image_8736549.png" alt="Sustainable Beauty" className="h-16" />
          </div>
        </div>
      </section>
    </div>
  )
}
