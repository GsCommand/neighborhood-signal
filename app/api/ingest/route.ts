import { NextRequest, NextResponse } from "next/server";
import { classifyLead } from "@/lib/classify";
import { addLead } from "@/lib/store";

export async function POST(request: NextRequest) {
  const configuredKey = process.env.INGEST_API_KEY;
  if (configuredKey) {
    const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (supplied !== configuredKey) {
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
  const lead = classifyLead({
    source: typeof payload.source === "string" ? payload.source : undefined,
    externalId: typeof payload.externalId === "string" ? payload.externalId : undefined,
    text: payload.text as string,
    neighborhood: typeof payload.neighborhood === "string" ? payload.neighborhood : undefined,
    city: typeof payload.city === "string" ? payload.city : undefined,
    url: typeof payload.url === "string" ? payload.url : undefined,
    publishedAt: typeof payload.publishedAt === "string" ? payload.publishedAt : undefined,
  });

  addLead(lead);
  return NextResponse.json({ accepted: true, lead }, { status: 201 });
}
