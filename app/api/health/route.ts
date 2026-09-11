import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";

export async function GET() {
  const database = await checkDatabaseConnection();
  const healthy = !database.configured || database.connected;

  return NextResponse.json(
    {
      ok: healthy,
      service: "neighborhood-signal",
      database: {
        configured: database.configured,
        connected: database.connected,
      },
    },
    {
      status: healthy ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
