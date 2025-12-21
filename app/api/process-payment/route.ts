import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, createServerClient2 } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, amount, donor_name, payment_type, file_id } = body;
    console.log("[v0] Processing payment request:", { phone, amount, file_id, donor_name, payment_type });

    // Validation
    if (!phone || !amount || !file_id) {
      console.error("[v0] Missing required fields");
      return NextResponse.json(
        { status: "error", error: "Missing required fields: phone, amount, or file_id" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const supabase2 = createServerClient2();

    console.log("[v0] Supabase clients created successfully");

    // Insert payment record to BOTH Supabase projects
    const paymentData = {
      project_id: file_id,
      phone_number: phone,
      amount: amount,
      payment_status: "pending",
    };

    const { data: paymentRecord, error: dbError } = await supabase
      .from("payments")
      .insert([paymentData])
      .select()
      .single();

    if (dbError) {
      console.error("[v0] Supabase 1 insert failed:", dbError);
      return NextResponse.json(
        { status: "error", error: "Database insert failed", details: dbError },
        { status: 500 }
      );
    }

    // Also insert to second Supabase project (let it generate its own ID)
    const { error: db2Error } = await supabase2
      .from("payments")
      .insert([paymentData]); // Don't include the ID, let Supabase 2 generate its own

    if (db2Error) {
      console.warn("[v0] Supabase 2 insert failed:", db2Error);
      // Continue anyway - primary DB succeeded
    } else {
      console.log("[v0] Payment record also saved to Supabase 2");
    }

    console.log("[v0] Payment record created:", paymentRecord.id);

    // Call your PHP payment processor
    console.log("[v0] Calling PHP payment processor...");
    const response = await fetch(
      "https://remote.victoryschoolclub.co.ke/process-payment.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount,
          donor_name: donor_name || "Student",
          payment_type: payment_type || "project_file",
          payment_id: paymentRecord.id, // send DB ID
        }),
      }
    );

    console.log("[v0] PHP response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[v0] PHP returned error:", response.status, errorText);
      throw new Error(`PHP payment processor failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("[v0] Payment API response:", data);

    // Log any Supabase save warnings from PHP
    if (data.warning) {
      console.warn("[v0] PHP Supabase warning:", data.warning);
    }

    if (data.status === "success") {
      // Update primary Supabase with transaction reference
      await supabase
        .from("payments")
        .update({ transaction_id: data.reference || paymentRecord.id })
        .eq("id", paymentRecord.id);

      // Update secondary Supabase by matching phone and amount (since ID differs)
      await supabase2
        .from("payments")
        .update({ 
          transaction_id: data.reference || paymentRecord.id,
          payment_status: "success" 
        })
        .eq("phone_number", phone)
        .eq("amount", amount)
        .eq("payment_status", "pending")
        .order("created_at", { ascending: false })
        .limit(1);

      return NextResponse.json({
        status: "success",
        reference: data.reference || paymentRecord.id,
        payment_id: paymentRecord.id,
        supabase1_saved: data.supabase1_saved,
        supabase2_saved: data.supabase2_saved,
      });
    } else {
      // Update both to failed status
      await supabase
        .from("payments")
        .update({ payment_status: "failed" })
        .eq("id", paymentRecord.id);

      // Update secondary Supabase by matching phone and amount
      await supabase2
        .from("payments")
        .update({ payment_status: "failed" })
        .eq("phone_number", phone)
        .eq("amount", amount)
        .eq("payment_status", "pending")
        .order("created_at", { ascending: false })
        .limit(1);

      return NextResponse.json(
        { status: "error", error: data.error || "Payment initiation failed" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("[v0] Payment processing error:", error);
    return NextResponse.json(
      { status: "error", error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
