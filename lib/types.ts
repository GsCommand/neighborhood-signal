export type SourceName = "Nextdoor" | "Facebook" | "Reddit" | "Webhook" | "Manual";
export type LeadStatus = "new" | "reviewing" | "contacted" | "won" | "lost";
export type Urgency = "low" | "medium" | "high";

export type Lead = {
  id: string;
  source: SourceName;
  externalId?: string;
  author?: string;
  text: string;
  neighborhood: string;
  city: string;
  service: string;
  score: number;
  urgency: Urgency;
  recommendationIntent: boolean;
  status: LeadStatus;
  publishedAt: string;
  url?: string;
  reasons: string[];
  estimatedValue: string;
};

export type Customer = {
  id: string;
  name: string;
  neighborhood: string;
  city: string;
  service: string;
  completedAt: string;
  recommendable: boolean;
};

export type Territory = {
  name: string;
  city: string;
  services: string[];
  active: boolean;
};
