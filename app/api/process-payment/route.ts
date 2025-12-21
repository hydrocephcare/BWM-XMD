import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, amount, donor_name, payment_type, file_id } = body;

    if (!phone || !amount || amount <= 0) {
      return NextResponse.json({ status: "error", error: "Phone and valid amount required" }, { status: 400 });
    }

    console.log("[v1] Processing payment request:", { phone, amount, file_id });

    const supabase = createClient();

    // Insert pending payment record
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
      .single();

    if (dbError || !paymentRecord) {
      console.error("[v1] Database insert error:", dbError);
      return NextResponse.json({ status: "error", error: "Database insert failed" }, { status: 500 });
    }

    console.log("[v1] Payment record created:", paymentRecord.id);

    // Call PHP payment endpoint
    const response = await fetch("https://remote.victoryschoolclub.co.ke/process-payment.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        amount,
        donor_name: donor_name || "Student",
        payment_type: payment_type || "project_file",
        payment_id: paymentRecord.id,
      }),
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.error("[v1] PHP endpoint returned invalid JSON:", err);
      // Mark Supabase record as failed
      await supabase.from("payments").update({ payment_status: "failed" }).eq("id", paymentRecord.id);
      return NextResponse.json({ status: "error", error: "Invalid response from payment server" }, { status: 500 });
    }

    console.log("[v1] Payment API response:", data);

    if (data.status === "success") {
      // Update Supabase with transaction ID
      await supabase
        .from("payments")
        .update({ transaction_id: data.reference || paymentRecord.id })
        .eq("id", paymentRecord.id);

      return NextResponse.json({
        status: "success",
        reference: data.reference || paymentRecord.id,
        payment_id: paymentRecord.id,
      });
    } else {
      // Mark as failed
      await supabase.from("payments").update({ payment_status: "failed" }).eq("id", paymentRecord.id);

      return NextResponse.json(
        {
          status: "error",
          error: data.error || "Payment initiation failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[v1] Unexpected error:", error);
    return NextResponse.json({ status: "error", error: "Server error" }, { status: 500 });
  }
}
