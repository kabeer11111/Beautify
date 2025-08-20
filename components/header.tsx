"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  User,
  Home,
  Package,
  Info,
  Phone,
  HelpCircle,
  Shield,
  FileText,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false) // State to control sheet open/close
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
  }, [])

  useEffect(() => {
    if (user) {
      fetchCartCount()
      fetchWishlistCount()

      const cartChannel = supabase
        .channel("cart_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "cart", filter: `user_id=eq.${user.id}` },
          (payload) => {
            console.log("Cart change detected:", payload)
            fetchCartCount()
          },
        )
        .subscribe()

      const wishlistChannel = supabase
        .channel("wishlist_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "wishlist", filter: `user_id=eq.${user.id}` },
          (payload) => {
            console.log("Wishlist change detected:", payload)
            fetchWishlistCount()
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(cartChannel)
        supabase.removeChannel(wishlistChannel)
      }
    } else {
      setCartCount(0)
      setWishlistCount(0)
    }
  }, [user])

  const fetchCartCount = async () => {
    if (!user) return
    const { count, error } = await supabase.from("cart").select("id", { count: "exact" }).eq("user_id", user.id)

    if (error) {
      console.error("Error fetching cart count:", error)
    } else {
      setCartCount(count || 0)
    }
  }

  const fetchWishlistCount = async () => {
    if (!user) return
    const { count, error } = await supabase.from("wishlist").select("id", { count: "exact" }).eq("user_id", user.id)

    if (error) {
      console.error("Error fetching wishlist count:", error)
    } else {
      setWishlistCount(count || 0)
    }
  }

  const refreshCounts = async () => {
    if (user) {
      await Promise.all([fetchCartCount(), fetchWishlistCount()])
    }
  }

  // Add this useEffect to set up a global refresh function
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).refreshHeaderCounts = refreshCounts
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).refreshHeaderCounts
      }
    }
  }, [user])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Logout Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
      router.push("/auth/login")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
      setIsSheetOpen(false) // Close sheet on search
    }
  }

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: Package },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
  ]

  const userLinks = [
    { name: "Profile", href: "/profile", icon: User },
    { name: "My Orders", href: "/orders", icon: Package },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Cart", href: "/cart", icon: ShoppingBag },
  ]

  const footerLinks = [
    { name: "Shipping", href: "/shipping", icon: null },
    { name: "Returns", href: "/returns", icon: null },
    { name: "Privacy Policy", href: "/privacy", icon: Shield },
    { name: "Terms of Service", href: "/terms", icon: FileText },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full max-w-screen-xl items-center justify-between px-4 md:px-6 mx-auto">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Eo_circle_pink_blank.svg/768px-Eo_circle_pink_blank.svg.png"
            alt="Beautify Logo"
            className="h-8 w-8"
          />
          Beautify
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium hover:underline underline-offset-4">
              {link.name}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/profile" className="text-sm font-medium hover:underline underline-offset-4">
                Profile
              </Link>
              <Link href="/orders" className="text-sm font-medium hover:underline underline-offset-4">
                Orders
              </Link>
            </>
          ) : (
            <Link href="/auth/login" className="text-sm font-medium hover:underline underline-offset-4">
              Login
            </Link>
          )}
        </nav>

        {/* Search, Cart, Wishlist, Theme Toggle */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="ghost" size="icon" className="ml-2">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </form>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/wishlist" className="relative">
              {" "}
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" className="relative">
              {" "}
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          <ThemeToggle />

          {user && (
            <Button variant="ghost" onClick={handleLogout} className="hidden md:inline-flex">
              Logout
            </Button>
          )}

          {/* Mobile Sheet */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs overflow-y-auto">
              <div className="flex flex-col gap-6 p-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setIsSheetOpen(false)}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Eo_circle_pink_blank.svg/768px-Eo_circle_pink_blank.svg.png"
                    alt="Beautify Logo"
                    className="h-8 w-8"
                  />
                  Beautify
                </Link>
                <form onSubmit={handleSearch} className="flex">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" variant="ghost" size="icon" className="ml-2">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                  </Button>
                </form>
                <nav className="grid gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setIsSheetOpen(false)} // Close sheet on link click
                    >
                      {link.icon && <link.icon className="h-5 w-5" />}
                      {link.name}
                    </Link>
                  ))}
                  {user ? (
                    <>
                      {userLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
                          onClick={() => setIsSheetOpen(false)} // Close sheet on link click
                        >
                          {link.icon && <link.icon className="h-5 w-5" />}
                          {link.name}
                        </Link>
                      ))}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleLogout()
                          setIsSheetOpen(false) // Close sheet on logout
                        }}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground justify-start"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setIsSheetOpen(false)} // Close sheet on link click
                    >
                      <User className="h-5 w-5" />
                      Login
                    </Link>
                  )}
                </nav>
                <div className="grid gap-2 border-t pt-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">Information</h3>
                  {footerLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setIsSheetOpen(false)} // Close sheet on link click
                    >
                      {link.icon && <link.icon className="h-5 w-5" />}
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
