import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const categories = [
  {
    name: "Skincare",
    description: "Nourish and protect your skin with our premium skincare collection.",
    image: "https://images.unsplash.com/photo-1687293375398-65aadbb792d1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQ0fHxza2luJTIwY2FyZXxlbnwwfHwwfHx8MA%3D%3D",
    slug: "skincare",
  },
  {
    name: "Makeup",
    description: "Express your unique style with our vibrant makeup range.",
    image: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fG1ha2V1cHxlbnwwfHwwfHx8MA%3D%3D",
    slug: "makeup",
  },
  {
    name: "Fragrance",
    description: "Discover signature scents for every mood and occasion.",
    image: "https://plus.unsplash.com/premium_photo-1679106770086-f4355693be1b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVyZnVtZXN8ZW58MHx8MHx8fDA%3D",
    slug: "fragrance",
  },
  {
    name: "Hair Care",
    description: "Achieve healthy, beautiful hair with our professional hair care products.",
    image: "https://images.unsplash.com/photo-1716304859621-f8b80c379228?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fGhhaXIlMjBjYXJlfGVufDB8fDB8fHww",
    slug: "haircare",
  },
  {
    name: "Body Care",
    description: "Pamper your body with luxurious care products.",
    image: "https://images.unsplash.com/photo-1706448703260-2ad13853602c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    slug: "bodycare",
  },
]

export function CategoryGrid() {
  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our diverse range of beauty products, meticulously organized to help you find exactly what you need.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Card key={category.slug} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <Link href={`/products?category=${category.slug}`} className="block">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-pink-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{category.description}</p>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View Products
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
