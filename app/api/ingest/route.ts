import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { classifyLead } from "@/lib/classify";
import { addLead } from "@/lib/store";
import { isPersistenceConfigured } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const configuredKey = process.env.INGEST_API_KEY || "";
  const deployed = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

  if (deployed && !configuredKey) {
    return NextResponse.json({ error: "Ingestion is disabled until INGEST_API_KEY is configured." }, { status: 503 });
  }

  if (deployed && !isPersistenceConfigured()) {
    return NextResponse.json({ error: "Ingestion is disabled until Supabase persistence is configured." }, { status: 503 });
  }

  if (configuredKey) {
    const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
    if (!constantTimeEqual(supplied, configuredKey)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be valid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("text" in body) || typeof body.text !== "string" || body.text.trim().length < 8) {
    return NextResponse.json({ error: "A text field of at least 8 characters is required." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const classified = classifyLead({
    source: typeof payload.source === "string" ? payload.source : undefined,
    externalId: typeof payload.externalId === "string" ? payload.externalId : undefined,
    text: payload.text as string,
    neighborhood: typeof payload.neighborhood === "string" ? payload.neighborhood : undefined,
    city: typeof payload.city === "string" ? payload.city : undefined,
    url: typeof payload.url === "string" ? payload.url : undefined,
    publishedAt: typeof payload.publishedAt === "string" ? payload.publishedAt : undefined,
  });

  try {
    const lead = await addLead(classified);
    return NextResponse.json({ accepted: true, persisted: isPersistenceConfigured(), lead }, { status: 201 });
  } catch (error) {
    console.error("Neighborhood Signal ingestion failed", error);
    return NextResponse.json({ error: "Lead ingestion failed." }, { status: 502 });
  }
}

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}
