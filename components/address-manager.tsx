"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Address {
  id: number
  type: "home" | "office" | "other"
  name: string
  street_address: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

export function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    type: "home" as "home" | "office" | "other",
    name: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "United States",
    is_default: false,
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive",
      })
    } else {
      setAddresses(data || [])
    }
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      type: "home",
      name: "",
      street_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "United States",
      is_default: false,
    })
    setIsAddingNew(false)
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    try {
      if (editingId) {
        // Update existing address
        const { error } = await supabase.from("addresses").update(formData).eq("id", editingId)

        if (error) throw error

        toast({
          title: "Success",
          description: "Address updated successfully",
        })
      } else {
        // Add new address
        const { error } = await supabase.from("addresses").insert({ ...formData, user_id: user.id })

        if (error) throw error

        toast({
          title: "Success",
          description: "Address added successfully",
        })
      }

      resetForm()
      fetchAddresses()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save address",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (address: Address) => {
    setFormData({
      type: address.type,
      name: address.name,
      street_address: address.street_address,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default,
    })
    setEditingId(address.id)
    setIsAddingNew(true)
  }

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("addresses").delete().eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Address deleted successfully",
      })
      fetchAddresses()
    }
  }

  const setAsDefault = async (id: number) => {
    const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to set default address",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Default address updated",
      })
      fetchAddresses()
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Addresses</h3>
        {addresses.length < 3 && !isAddingNew && (
          <Button onClick={() => setIsAddingNew(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        )}
      </div>

      {/* Existing Addresses */}
      <div className="grid gap-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium capitalize">{address.name}</span>
                    <Badge
                      variant={
                        address.type === "home" ? "default" : address.type === "office" ? "secondary" : "outline"
                      }
                    >
                      {address.type}
                    </Badge>
                    {address.is_default && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.street_address}
                    <br />
                    {address.city}, {address.state} {address.postal_code}
                    <br />
                    {address.country}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!address.is_default && (
                    <Button variant="outline" size="sm" onClick={() => setAsDefault(address.id)}>
                      Set Default
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleEdit(address)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(address.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Address" : "Add New Address"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Address Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "home" | "office" | "other") => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="name">Address Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Home, Office, etc."
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="street_address">Street Address</Label>
                <Input
                  id="street_address"
                  value={formData.street_address}
                  onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="NY"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    placeholder="10001"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="United States"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_default"
                  checked={formData.is_default}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked as boolean })}
                />
                <Label htmlFor="is_default">Set as default address</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingId ? "Update Address" : "Add Address"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
