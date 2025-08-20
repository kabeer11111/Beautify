"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, Ban, Trash2, UserCheck, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuthAndFetchUsers()
  }, [])

  const checkAuthAndFetchUsers = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/admin/login")
      return
    }

    // Check if user is admin
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

    await fetchUsers()
  }

  const fetchUsers = async () => {
    setLoading(true)
    let query = supabase
      .from("users")
      .select(`
        *,
        blacklisted_users!user_id(id, reason, blacklisted_at)
      `)
      .order("created_at", { ascending: false })

    if (searchTerm) {
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users. Check console for details.",
        variant: "destructive",
      })
    } else {
      // Normalize blacklisted_users to always be an array
      const normalizedData = (data || []).map((user) => ({
        ...user,
        blacklisted_users: user.blacklisted_users ?? [], // Fix: Ensure blacklisted_users is an array
      }))

      let filteredData = normalizedData

      if (statusFilter === "blacklisted") {
        filteredData = filteredData.filter((user) => user.blacklisted_users.length > 0)
      } else if (statusFilter === "active") {
        filteredData = filteredData.filter((user) => user.blacklisted_users.length === 0)
      }

      setUsers(filteredData)
    }
    setLoading(false)
  }

  const blacklistUser = async (userId: string, reason: string) => {
    const { error } = await supabase.from("blacklisted_users").insert({
      user_id: userId,
      reason: reason,
      blacklisted_by: (await supabase.auth.getUser()).data.user?.id,
    })

    if (error) {
      console.error("Error blacklisting user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to blacklist user. Check console for details.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "User has been blacklisted",
      })
      fetchUsers()
    }
  }

  const unblacklistUser = async (userId: string) => {
    const { error } = await supabase.from("blacklisted_users").delete().eq("user_id", userId)

    if (error) {
      console.error("Error unblacklisting user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to unblacklist user. Check console for details.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "User has been removed from blacklist",
      })
      fetchUsers()
    }
  }

  const deleteUser = async (userId: string) => {
    const { error } = await supabase.from("users").delete().eq("id", userId)

    if (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete user. Check console for details.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "User has been deleted",
      })
      fetchUsers()
    }
  }

  useEffect(() => {
    if (!loading) {
      fetchUsers()
    }
  }, [searchTerm, statusFilter])

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
              <Link href="/admin">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-sm text-muted-foreground">Manage user accounts ({users.length} users)</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active Users</SelectItem>
                  <SelectItem value="blacklisted">Blacklisted Users</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchUsers} variant="outline">
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-semibold">
                      {user.first_name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-muted-foreground">{user.email}</p>
                      <div className="flex flex-wrap items-center space-x-2 mt-1">
                        <Badge variant={user.blacklisted_users.length > 0 ? "destructive" : "default"}>
                          {user.blacklisted_users.length > 0 ? "Blacklisted" : "Active"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {user.blacklisted_users.length > 0 && (
                        <p className="text-sm text-red-600 mt-1">Reason: {user.blacklisted_users[0].reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:space-x-2">
                    {user.blacklisted_users.length > 0 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => unblacklistUser(user.id)}
                        className="text-green-600 hover:text-green-700 w-full sm:w-auto"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Unblacklist
                      </Button>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-yellow-600 hover:text-yellow-700 bg-transparent w-full sm:w-auto"
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Blacklist
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Blacklist User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to blacklist {user.first_name} {user.last_name}? Please provide a
                              reason.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <Input placeholder="Reason for blacklisting..." id={`reason-${user.id}`} />
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                const reason =
                                  (document.getElementById(`reason-${user.id}`) as HTMLInputElement)?.value ||
                                  "No reason provided"
                                blacklistUser(user.id, reason)
                              }}
                            >
                              Blacklist User
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to permanently delete {user.first_name} {user.last_name}? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteUser(user.id)}>Delete User</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {users.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No users found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
