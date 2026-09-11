import type { Lead, SourceName, Urgency } from "@/lib/types";

const serviceMatchers: Array<[string, RegExp]> = [
  ["Travertine sealing", /travertine/i],
  ["Pool deck sealing", /pool\s*deck|pool\s*pavers/i],
  ["Paver sealing", /paver|re-?sand|sealer/i],
  ["Pressure washing", /pressure\s*wash|power\s*wash|house\s*wash|driveway\s*clean/i],
];

const knownNeighborhoods = ["Nocatee", "Twenty Mile", "Ponte Vedra", "Sawgrass", "Wildlight", "Yulee", "St. Johns", "Fleming Island", "Jacksonville"];

export function classifyLead(input: {
  source?: string;
  externalId?: string;
  text: string;
  neighborhood?: string;
  city?: string;
  url?: string;
  publishedAt?: string;
}): Lead {
  const text = input.text.trim();
  const service = serviceMatchers.find(([, regex]) => regex.test(text))?.[0] ?? "Home service";
  const inferredNeighborhood = input.neighborhood || knownNeighborhoods.find((name) => text.toLowerCase().includes(name.toLowerCase())) || "Unknown";
  const recommendationIntent = /recommend|who do you use|who should i use|good experience|looking for (someone|a company)|anyone know/i.test(text);
  const explicitNeed = /need|looking|want|quote|estimate|recommend|anyone|who do you use/i.test(text);
  const timing = /today|tomorrow|this week|asap|before|soon|ready to|looking to get/i.test(text);
  const problem = /faded|chalky|dirty|washing out|loose|stain|mildew|algae|needs? fresh/i.test(text);

  let score = 45;
  if (service !== "Home service") score += 18;
  if (recommendationIntent) score += 18;
  if (explicitNeed) score += 10;
  if (timing) score += 6;
  if (problem) score += 5;
  if (inferredNeighborhood !== "Unknown") score += 4;
  score = Math.min(99, score);

  const urgency: Urgency = score >= 90 || timing ? "high" : score >= 70 ? "medium" : "low";
  const reasons = [
    service !== "Home service" ? `Matched ${service.toLowerCase()}` : null,
    recommendationIntent ? "Recommendation request detected" : null,
    explicitNeed ? "Active buying language" : null,
    timing ? "Timing/urgency signal" : null,
    problem ? "Specific property problem described" : null,
    inferredNeighborhood !== "Unknown" ? "Location identified" : null,
  ].filter(Boolean) as string[];

  return {
    id: `lead-${crypto.randomUUID()}`,
    source: normalizeSource(input.source),
    externalId: input.externalId,
    text,
    neighborhood: inferredNeighborhood,
    city: input.city || inferredNeighborhood,
    service,
    score,
    urgency,
    recommendationIntent,
    status: "new",
    publishedAt: input.publishedAt || new Date().toISOString(),
    url: input.url,
    reasons,
    estimatedValue: estimateValue(service),
  };
}

function normalizeSource(source?: string): SourceName {
  const match = (source || "Webhook").toLowerCase();
  if (match === "nextdoor") return "Nextdoor";
  if (match === "facebook") return "Facebook";
  if (match === "reddit") return "Reddit";
  if (match === "manual") return "Manual";
  return "Webhook";
}

function estimateValue(service: string) {
  if (service === "Paver sealing") return "$1,000–$2,500";
  if (service === "Travertine sealing") return "$1,200–$3,000";
  if (service === "Pool deck sealing") return "$1,300–$3,500";
  if (service === "Pressure washing") return "$250–$900";
  return "$300–$1,500";
}
