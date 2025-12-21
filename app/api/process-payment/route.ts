import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, amount, donor_name, payment_type, file_id } = body

    console.log("[v0] Processing payment request:", { phone, amount, file_id })

    const supabase = createClient()
    const { data: paymentRecord, error: dbError } = await supabase
      .from("payments")
      .insert([
        {
          project_id: file_id,
          phone_number: phone,
          amount: amount,
          payment_status: "pending",
        },
      ])
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      throw dbError
    }

    console.log("[v0] Payment record created:", paymentRecord.id)

    // Call the PHP endpoint for payment processing
    const response = await fetch("https://remote.victoryschoolclub.co.ke/process-payment.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        amount,
        donor_name: donor_name || "Student",
        payment_type: payment_type || "project_file",
        payment_id: paymentRecord.id, // Send our database ID
      }),
    })

    const data = await response.json()
    console.log("[v0] Payment API response:", data)

    if (data.status === "success") {
      await supabase
        .from("payments")
        .update({ transaction_id: data.reference || paymentRecord.id })
        .eq("id", paymentRecord.id)

      return NextResponse.json({
        status: "success",
        reference: data.reference || paymentRecord.id,
        payment_id: paymentRecord.id,
      })
    } else {
      // Mark as failed
      await supabase.from("payments").update({ payment_status: "failed" }).eq("id", paymentRecord.id)

      return NextResponse.json(
        {
          status: "error",
          error: data.error || "Payment initiation failed",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("[v0] Payment processing error:", error)
    return NextResponse.json(
      {
        status: "error",
        error: "Server error",
      },
      { status: 500 },
    )
  }
}
