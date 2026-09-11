import { leads as seededLeads } from "@/lib/demo-data";
import { isPersistenceConfigured, supabaseRest } from "@/lib/supabase-rest";
import type { Lead, LeadStatus, SourceName, Urgency } from "@/lib/types";

type LeadRow = {
  id: string;
  source: string;
  external_id: string | null;
  original_text: string;
  url: string | null;
  neighborhood: string | null;
  city: string | null;
  service: string | null;
  score: number;
  urgency: string;
  recommendation_intent: boolean;
  status: string;
  reasons: unknown;
  estimated_value: string | null;
  published_at: string | null;
  created_at: string;
};

type OrganizationRow = { id: string };

const globalStore = globalThis as unknown as {
  neighborhoodSignalLeads?: Lead[];
  neighborhoodSignalOrgId?: string;
};

function getMemoryLeads() {
  if (!globalStore.neighborhoodSignalLeads) {
    globalStore.neighborhoodSignalLeads = structuredClone(seededLeads);
  }
  return globalStore.neighborhoodSignalLeads;
}

async function getOrganizationId() {
  if (process.env.NEIGHBORHOOD_SIGNAL_ORG_ID) return process.env.NEIGHBORHOOD_SIGNAL_ORG_ID;
  if (globalStore.neighborhoodSignalOrgId) return globalStore.neighborhoodSignalOrgId;

  const name = process.env.NEIGHBORHOOD_SIGNAL_ORG_NAME || "HydroSeal Demo";
  const encodedName = encodeURIComponent(name);
  const existing = await supabaseRest<OrganizationRow[]>(`organizations?select=id&name=eq.${encodedName}&limit=1`);
  if (existing[0]?.id) {
    globalStore.neighborhoodSignalOrgId = existing[0].id;
    return existing[0].id;
  }

  const created = await supabaseRest<OrganizationRow[]>("organizations?select=id", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ name }),
  });
  if (!created[0]?.id) throw new Error("Could not create Neighborhood Signal organization.");
  globalStore.neighborhoodSignalOrgId = created[0].id;
  return created[0].id;
}

export async function getLeads() {
  if (!isPersistenceConfigured()) return getMemoryLeads();

  try {
    const organizationId = await getOrganizationId();
    const rows = await supabaseRest<LeadRow[]>(
      `leads?select=id,source,external_id,original_text,url,neighborhood,city,service,score,urgency,recommendation_intent,status,reasons,estimated_value,published_at,created_at&organization_id=eq.${organizationId}&order=created_at.desc&limit=100`,
    );
    return rows.length ? rows.map(mapLeadRow) : getMemoryLeads();
  } catch (error) {
    console.error("Neighborhood Signal database read failed", error);
    return getMemoryLeads();
  }
}

export async function addLead(lead: Lead) {
  if (!isPersistenceConfigured()) {
    const leads = getMemoryLeads();
    leads.unshift(lead);
    return lead;
  }

  const organizationId = await getOrganizationId();
  const payload = {
    organization_id: organizationId,
    source: lead.source,
    external_id: lead.externalId || null,
    original_text: lead.text,
    url: lead.url || null,
    neighborhood: lead.neighborhood || null,
    city: lead.city || null,
    service: lead.service || null,
    score: lead.score,
    urgency: lead.urgency,
    recommendation_intent: lead.recommendationIntent,
    reasons: lead.reasons,
    estimated_value: lead.estimatedValue || null,
    published_at: lead.publishedAt || null,
  };

  const rows = await supabaseRest<LeadRow[]>(
    "leads?on_conflict=organization_id,source,external_id&select=id,source,external_id,original_text,url,neighborhood,city,service,score,urgency,recommendation_intent,status,reasons,estimated_value,published_at,created_at",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(payload),
    },
  );

  const persisted = rows[0];
  if (!persisted) throw new Error("Supabase did not return the persisted lead.");

  await supabaseRest("audit_events", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      organization_id: organizationId,
      event_type: "lead_ingested",
      entity_type: "lead",
      entity_id: persisted.id,
      metadata: { source: persisted.source, external_id: persisted.external_id },
    }),
  });

  return mapLeadRow(persisted);
}

function mapLeadRow(row: LeadRow): Lead {
  return {
    id: row.id,
    source: normalizeSource(row.source),
    externalId: row.external_id || undefined,
    text: row.original_text,
    neighborhood: row.neighborhood || "Unknown",
    city: row.city || row.neighborhood || "Unknown",
    service: row.service || "Home service",
    score: row.score,
    urgency: normalizeUrgency(row.urgency),
    recommendationIntent: row.recommendation_intent,
    status: normalizeStatus(row.status),
    publishedAt: row.published_at || row.created_at,
    url: row.url || undefined,
    reasons: Array.isArray(row.reasons) ? row.reasons.filter((value): value is string => typeof value === "string") : [],
    estimatedValue: row.estimated_value || "$300–$1,500",
  };
}

function normalizeSource(value: string): SourceName {
  const normalized = value.toLowerCase();
  if (normalized === "nextdoor") return "Nextdoor";
  if (normalized === "facebook") return "Facebook";
  if (normalized === "reddit") return "Reddit";
  if (normalized === "manual") return "Manual";
  return "Webhook";
}

function normalizeUrgency(value: string): Urgency {
  return value === "high" || value === "medium" ? value : "low";
}

function normalizeStatus(value: string): LeadStatus {
  if (value === "reviewing" || value === "contacted" || value === "won" || value === "lost") return value;
  return "new";
}
