import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get('payment_id');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Missing payment_id parameter' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Query Supabase 1 (the main database) by ID
    const { data, error } = await supabase
      .from('payments')
      .select('payment_status, id')
      .eq('id', paymentId)
      .single();

    if (error) {
      console.error('[v0] Error fetching payment:', error);
      return NextResponse.json(
        { error: 'Payment not found', details: error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      payment_status: data.payment_status,
      payment_id: data.id
    });
  } catch (error: any) {
    console.error('[v0] Check payment error:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}
