import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ error: "Reference required" }, { status: 400 })
    }

    // Check payment status via PHP callback or Supabase
    const supabaseUrl = "https://mcglwbcsyvtbmuegfamt.supabase.co"
    const supabaseKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jZ2x3YmNzeXZ0Ym11ZWdmYW10Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM1OTU5OSwiZXhwIjoyMDc5OTM1NTk5fQ.dhwCXxARbhpAaAoMS71lwRzaWrqohX0_nK4kSh9XNFo"

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
