import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/data-service";
import { mockContacts } from "@/lib/mock-data";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ contacts: mockContacts, source: "mock" });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contacts")
      .select("*, companies(name)")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ contacts: data, source: "supabase" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isSupabaseConfigured()) {
      const newContact = {
        id: `cont-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...body,
      };
      return NextResponse.json({ contact: newContact, source: "mock" }, { status: 201 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contacts")
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ contact: data, source: "supabase" }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
