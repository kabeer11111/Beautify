"use client"

import { Suspense } from "react"
import { ProductsGrid } from "@/components/products-grid"
import { ProductFilters } from "@/components/product-filters"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground">Discover our complete collection of premium beauty products</p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <Suspense fallback={<div>Loading filters...</div>}>
          <ProductFilters />
        </Suspense>
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductsGrid />
        </Suspense>
      </div>
    </div>
  )
}
