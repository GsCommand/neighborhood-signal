import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ingestKey = process.env.INGEST_API_KEY;
  if (!ingestKey) {
    return NextResponse.json({ ok: false, ingestKeyConfigured: false }, { status: 503 });
  }

  const response = await fetch(new URL("/api/ingest", request.nextUrl.origin), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ingestKey}`,
    },
    body: JSON.stringify({
      source: "manual",
      externalId: "smoke-auth-2026-09-11-prod",
      text: "Authenticated production smoke test: homeowner in Nocatee needs driveway paver cleaning, re-sanding and sealing.",
      neighborhood: "Nocatee",
      city: "Ponte Vedra",
      publishedAt: new Date().toISOString(),
    }),
    cache: "no-store",
  });

  let result: unknown;
  const text = await response.text();
  try {
    result = JSON.parse(text);
  } catch {
    result = { body: text.slice(0, 500) };
  }

  return NextResponse.json({
    ok: response.ok,
    ingestKeyConfigured: true,
    ingestStatus: response.status,
    result,
  }, { status: response.ok ? 200 : 502, headers: { "Cache-Control": "no-store" } });
}
