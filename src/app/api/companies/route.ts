import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/data-service";
import { mockCompanies } from "@/lib/mock-data";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ companies: mockCompanies, source: "mock" });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ companies: data, source: "supabase" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isSupabaseConfigured()) {
      const newCompany = {
        id: `comp-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...body,
      };
      return NextResponse.json({ company: newCompany, source: "mock" }, { status: 201 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("companies")
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ company: data, source: "supabase" }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
