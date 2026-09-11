import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IDS = [
  "d25684b2-6fc4-4bfb-aedc-cf3b2f1323ac",
  "29f39a3e-9b39-4a6a-81ab-36f625558ce3",
];

export async function GET() {
  const filter = `in.(${IDS.join(",")})`;

  await supabaseRest(`audit_events?entity_id=${filter}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });

  await supabaseRest(`leads?id=${filter}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });

  return NextResponse.json({ ok: true, cleaned: IDS.length }, { headers: { "Cache-Control": "no-store" } });
}
