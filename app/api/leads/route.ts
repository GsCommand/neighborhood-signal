import { NextResponse } from "next/server";
import { getLeads } from "@/lib/store";
import { isPersistenceConfigured } from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";

export async function GET() {
  const leads = await getLeads();
  return NextResponse.json(
    {
      leads,
      persistence: isPersistenceConfigured() ? "supabase" : "memory",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
