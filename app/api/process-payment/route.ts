import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, amount, donor_name, payment_type, file_id } = body

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
      }),
    })

    const data = await response.json()

    if (data.status === "success") {
      return NextResponse.json({
        status: "success",
        reference: data.reference,
      })
    } else {
      return NextResponse.json(
        {
          status: "error",
          error: data.error || "Payment initiation failed",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: "Server error",
      },
      { status: 500 },
    )
  }
}
