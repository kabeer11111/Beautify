"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<number | string>("")
  const [stock, setStock] = useState<number | string>("")
  const [category, setCategory] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([""])
  const [benefits, setBenefits] = useState<string[]>([""])
  const [productDetails, setProductDetails] = useState<string[]>([""])
  const [specifications, setSpecifications] = useState<string[]>([""])
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuthAndFetchProduct()
  }, [id])

  const checkAuthAndFetchProduct = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/admin/login")
      return
    }

    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", user.email)
      .eq("is_active", true)
      .single()

    if (adminError || !adminUser) {
      console.error("Admin check failed:", adminError)
      router.push("/")
      return
    }

    await fetchProduct()
  }

  const fetchProduct = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch product. Check console for details.",
        variant: "destructive",
      })
      router.push("/admin/products") // Redirect if product not found or error
    } else if (data) {
      setName(data.name || "")
      setDescription(data.description || "")
      setPrice(data.price || "")
      setStock(data.stock || "")
      setCategory(data.category || "")
      setImageUrls(data.image_urls?.length > 0 ? data.image_urls : [""])
      setBenefits(data.benefits?.length > 0 ? data.benefits : [""])
      setProductDetails(data.product_details?.length > 0 ? data.product_details : [""])
      setSpecifications(data.specifications?.length > 0 ? data.specifications : [""])
      setIsActive(data.is_active)
    }
    setLoading(false)
  }

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...imageUrls]
    newImageUrls[index] = value
    setImageUrls(newImageUrls)
  }

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, ""])
  }

  const removeImageUrlField = (index: number) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index)
    setImageUrls(newImageUrls)
  }

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits]
    newBenefits[index] = value
    setBenefits(newBenefits)
  }

  const addBenefitField = () => {
    setBenefits([...benefits, ""])
  }

  const removeBenefitField = (index: number) => {
    const newBenefits = benefits.filter((_, i) => i !== index)
    setBenefits(newBenefits)
  }

  const handleProductDetailChange = (index: number, value: string) => {
    const newProductDetails = [...productDetails]
    newProductDetails[index] = value
    setProductDetails(newProductDetails)
  }

  const addProductDetailField = () => {
    setProductDetails([...productDetails, ""])
  }

  const removeProductDetailField = (index: number) => {
    const newProductDetails = productDetails.filter((_, i) => i !== index)
    setProductDetails(newProductDetails)
  }

  const handleSpecificationChange = (index: number, value: string) => {
    const newSpecifications = [...specifications]
    newSpecifications[index] = value
    setSpecifications(newSpecifications)
  }

  const addSpecificationField = () => {
    setSpecifications([...specifications, ""])
  }

  const removeSpecificationField = (index: number) => {
    const newSpecifications = specifications.filter((_, i) => i !== index)
    setSpecifications(newSpecifications)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const productData = {
      name,
      description,
      price: Number.parseFloat(price as string),
      stock: Number.parseInt(stock as string),
      category,
      image_urls: imageUrls.filter((url) => url.trim() !== ""),
      benefits: benefits.filter((b) => b.trim() !== ""),
      product_details: productDetails.filter((pd) => pd.trim() !== ""),
      specifications: specifications.filter((s) => s.trim() !== ""),
      is_active: isActive,
    }

    const { error } = await supabase.from("products").update(productData).eq("id", id)

    if (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update product. Check console for details.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Product updated successfully!",
      })
      router.push("/admin/products")
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Product Management</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Product</h1>
              <p className="text-sm text-muted-foreground">Modify details for &quot;{name || "Loading..."}&quot;</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                </div>
              </div>

              <div>
                <Label>Image URLs</Label>
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                    <Input
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      placeholder="Enter image URL"
                    />
                    {imageUrls.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeImageUrlField(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full sm:w-auto bg-transparent"
                  onClick={addImageUrlField}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Image URL
                </Button>
              </div>

              <div>
                <Label>Benefits (e.g., "Waterproof", "Durable")</Label>
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                    <Input
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      placeholder="Enter benefit"
                    />
                    {benefits.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeBenefitField(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full sm:w-auto bg-transparent"
                  onClick={addBenefitField}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Benefit
                </Button>
              </div>

              <div>
                <Label>Product Details (e.g., "Material: Cotton", "Weight: 200g")</Label>
                {productDetails.map((detail, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                    <Input
                      value={detail}
                      onChange={(e) => handleProductDetailChange(index, e.target.value)}
                      placeholder="Enter product detail"
                    />
                    {productDetails.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeProductDetailField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full sm:w-auto bg-transparent"
                  onClick={addProductDetailField}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Product Detail
                </Button>
              </div>

              <div>
                <Label>Specifications (e.g., "Processor: Intel i7", "RAM: 16GB")</Label>
                {specifications.map((spec, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                    <Input
                      value={spec}
                      onChange={(e) => handleSpecificationChange(index, e.target.value)}
                      placeholder="Enter specification"
                    />
                    {specifications.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeSpecificationField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full sm:w-auto bg-transparent"
                  onClick={addSpecificationField}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Specification
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="isActive" checked={isActive} onCheckedChange={(checked) => setIsActive(!!checked)} />
                <Label htmlFor="isActive">Product is Active</Label>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? "Updating Product..." : "Update Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/products")}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
