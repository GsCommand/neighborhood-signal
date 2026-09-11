const DEFAULT_SUPABASE_URL = "https://eynkqsxxwudsbskewahj.supabase.co";

export function isPersistenceConfigured() {
  return Boolean(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseUrl() {
  return (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, "");
}

function getSecretKey() {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export async function supabaseRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const secretKey = getSecretKey();
  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY is not configured.");

  const headers = new Headers(init.headers);
  headers.set("apikey", secretKey);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(`${getSupabaseUrl()}/rest/v1/${path.replace(/^\//, "")}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase REST ${response.status}: ${body.slice(0, 700)}`);
  }

  if (response.status === 204) return null as T;
  const text = await response.text();
  if (!text) return null as T;
  return JSON.parse(text) as T;
}

export async function checkDatabaseConnection() {
  if (!isPersistenceConfigured()) return { configured: false, connected: false };
  try {
    await supabaseRest<Array<{ id: string }>>("organizations?select=id&limit=1");
    return { configured: true, connected: true };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
}
