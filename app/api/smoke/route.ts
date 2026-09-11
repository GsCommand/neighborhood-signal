import { NextResponse } from "next/server";
import { classifyLead } from "@/lib/classify";
import { addLead } from "@/lib/store";
import { isPersistenceConfigured } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.INGEST_API_KEY) {
    return NextResponse.json({ ok: false, ingestKeyConfigured: false }, { status: 503 });
  }

  if (!isPersistenceConfigured()) {
    return NextResponse.json({ ok: false, ingestKeyConfigured: true, persistenceConfigured: false }, { status: 503 });
  }

  const classified = classifyLead({
    source: "manual",
    externalId: "smoke-2026-09-11-prod",
    text: "Production smoke test: homeowner in Nocatee is looking for someone to clean, re-sand and seal driveway pavers.",
    neighborhood: "Nocatee",
    city: "Ponte Vedra",
    publishedAt: new Date().toISOString(),
  });

  const lead = await addLead(classified);

  return NextResponse.json({
    ok: true,
    ingestKeyConfigured: true,
    persistenceConfigured: true,
    lead: {
      id: lead.id,
      externalId: lead.externalId,
      service: lead.service,
      score: lead.score,
      recommendationIntent: lead.recommendationIntent,
    },
  }, { headers: { "Cache-Control": "no-store" } });
}
