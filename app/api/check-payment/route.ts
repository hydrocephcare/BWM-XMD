import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ error: "Reference required" }, { status: 400 })
    }

    // Use environment variables instead of hardcoded values
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const response = await fetch(`${supabaseUrl}/rest/v1/payments?external_reference=eq.${reference}`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    })

    const data = await response.json()

    if (data && data.length > 0) {
      return NextResponse.json({
        status: data[0].status,
        payment: data[0],
      })
    } else {
      return NextResponse.json({
        status: "pending",
      })
    }
  } catch (error) {
    return NextResponse.json({
      status: "pending",
    })
  }
}
