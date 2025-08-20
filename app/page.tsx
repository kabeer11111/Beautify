import { Suspense } from "react"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { CategoryGrid } from "@/components/category-grid"
import { NewsletterSection } from "@/components/newsletter-section"
import { AnimateOnScroll } from "@/components/animate-on-scroll"

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<LoadingSpinner />}>
        <AnimateOnScroll duration={500}>
          <HeroSection />
        </AnimateOnScroll>

        <AnimateOnScroll delay={100} duration={600}>
          <FeaturedProducts />
        </AnimateOnScroll>

        <AnimateOnScroll delay={150} duration={600}>
          <CategoryGrid />
        </AnimateOnScroll>

        <AnimateOnScroll delay={200} duration={600}>
          <NewsletterSection />
        </AnimateOnScroll>
      </Suspense>
    </div>
  )
}
