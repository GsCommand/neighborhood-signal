import { leads as seededLeads } from "@/lib/demo-data";
import type { Lead } from "@/lib/types";

const globalStore = globalThis as unknown as { neighborhoodSignalLeads?: Lead[] };

export function getLeads() {
  if (!globalStore.neighborhoodSignalLeads) {
    globalStore.neighborhoodSignalLeads = structuredClone(seededLeads);
  }
  return globalStore.neighborhoodSignalLeads;
}

export function addLead(lead: Lead) {
  const leads = getLeads();
  leads.unshift(lead);
  return lead;
}
