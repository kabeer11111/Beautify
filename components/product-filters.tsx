"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, Filter, Search } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface FilterState {
  categories: string[]
  brands: string[]
  minPrice: string
  maxPrice: string
  search: string
}

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [availableBrands, setAvailableBrands] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams.getAll("category"),
    brands: searchParams.getAll("brand"),
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    search: searchParams.get("search") || "",
  })

  const categories = [
    { id: "skincare", label: "Skincare" },
    { id: "haircare", label: "Hair Care" },
    { id: "makeup", label: "Makeup" },
    { id: "bodycare", label: "Body Care" },
    { id: "fragrance", label: "Fragrance" },
  ]

  const quickPriceFilters = [
    { label: "Under ₹500", min: "", max: "500" },
    { label: "₹500 - ₹1000", min: "500", max: "1000" },
    { label: "₹1000 - ₹2000", min: "1000", max: "2000" },
    { label: "Above ₹2000", min: "2000", max: "" },
  ]

  useEffect(() => {
    fetchAvailableBrands()
  }, [])

  const fetchAvailableBrands = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("brand")
      .eq("is_active", true)
      .order("brand", { ascending: true })

    if (!error && data) {
      const uniqueBrands = [...new Set(data.map((item) => item.brand).filter(Boolean))]
      setAvailableBrands(uniqueBrands)
    }
  }

  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams()

    // Add categories
    newFilters.categories.forEach((category) => {
      params.append("category", category)
    })

    // Add brands
    newFilters.brands.forEach((brand) => {
      params.append("brand", brand)
    })

    // Add price range
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice)
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice)

    // Add search
    if (newFilters.search) params.set("search", newFilters.search)

    router.push(`/products?${params.toString()}`)
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((c) => c !== categoryId)

    const newFilters = { ...filters, categories: newCategories }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked ? [...filters.brands, brand] : filters.brands.filter((b) => b !== brand)

    const newFilters = { ...filters, brands: newBrands }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const handlePriceChange = (field: "minPrice" | "maxPrice", value: string) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    // Debounce URL update for price inputs
    setTimeout(() => updateURL(newFilters), 500)
  }

  const handleQuickPriceFilter = (min: string, max: string) => {
    const newFilters = { ...filters, minPrice: min, maxPrice: max }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value }
    setFilters(newFilters)
    // Debounce URL update for search
    setTimeout(() => updateURL(newFilters), 500)
  }

  const clearAllFilters = () => {
    const newFilters: FilterState = {
      categories: [],
      brands: [],
      minPrice: "",
      maxPrice: "",
      search: "",
    }
    setFilters(newFilters)
    router.push("/products")
  }

  const removeFilter = (type: string, value: string) => {
    const newFilters = { ...filters }

    switch (type) {
      case "category":
        newFilters.categories = filters.categories.filter((c) => c !== value)
        break
      case "brand":
        newFilters.brands = filters.brands.filter((b) => b !== value)
        break
      case "search":
        newFilters.search = ""
        break
      case "price":
        newFilters.minPrice = ""
        newFilters.maxPrice = ""
        break
    }

    setFilters(newFilters)
    updateURL(newFilters)
  }

  const hasActiveFilters =
    filters.categories.length > 0 || filters.brands.length > 0 || filters.minPrice || filters.maxPrice || filters.search

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search for products..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Active Filters
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filters.categories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {categories.find((c) => c.id === category)?.label || category}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("category", category)} />
                </Badge>
              ))}
              {filters.brands.map((brand) => (
                <Badge key={brand} variant="outline" className="flex items-center gap-1">
                  {brand}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("brand", brand)} />
                </Badge>
              ))}
              {filters.search && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Search: "{filters.search}"
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("search", "")} />
                </Badge>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <Badge variant="outline" className="flex items-center gap-1">
                  ₹{filters.minPrice || "0"} - ₹{filters.maxPrice || "∞"}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("price", "")} />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      {!filters.search && (
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                />
                <Label htmlFor={category.id} className="text-sm font-normal cursor-pointer">
                  {category.label}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle>Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-60 overflow-y-auto">
          {availableBrands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={filters.brands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
              />
              <Label htmlFor={brand} className="text-sm font-normal cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle>Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Price Filters */}
          <div className="grid grid-cols-1 gap-2">
            {quickPriceFilters.map((filter) => (
              <Button
                key={filter.label}
                variant="outline"
                size="sm"
                onClick={() => handleQuickPriceFilter(filter.min, filter.max)}
                className={
                  filters.minPrice === filter.min && filters.maxPrice === filter.max
                    ? "bg-pink-50 border-pink-200 text-pink-700"
                    : ""
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <Separator />

          {/* Custom Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Custom Range</Label>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                  Min Price
                </Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="₹0"
                  value={filters.minPrice}
                  onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                  className="mt-1"
                />
              </div>
              <span className="text-muted-foreground mt-6">to</span>
              <div className="flex-1">
                <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                  Max Price
                </Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="₹∞"
                  value={filters.maxPrice}
                  onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
