import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Create or update user profile
      const { error: profileError } = await supabase.from("users").upsert({
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.user_metadata?.first_name || data.user.user_metadata?.full_name?.split(" ")[0] || "",
        last_name:
          data.user.user_metadata?.last_name || data.user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error("Error creating user profile:", profileError)
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
