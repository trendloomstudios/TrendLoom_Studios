import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/data-service";
import { mockDeals } from "@/lib/mock-data";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ deals: mockDeals, source: "mock" });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("deals")
      .select("*, companies(name), contacts(first_name, last_name)")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deals: data, source: "supabase" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isSupabaseConfigured()) {
      const newDeal = {
        id: `deal-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...body,
      };
      return NextResponse.json({ deal: newDeal, source: "mock" }, { status: 201 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("deals")
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ deal: data, source: "supabase" }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
