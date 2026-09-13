export type AgentAutonomy = "observe" | "draft" | "execute-internal";
export type AgentStatus = "ready" | "watching" | "blocked";

export type AgentDefinition = {
  id: string;
  name: string;
  role: string;
  mission: string;
  status: AgentStatus;
  autonomy: AgentAutonomy;
  cadence: string;
  lastTask: string;
  outputs: string[];
  approvalRequired: string[];
};

export type AgentTask = {
  id: string;
  agentId: string;
  title: string;
  priority: "P0" | "P1" | "P2";
  state: "queued" | "ready" | "blocked";
  trigger: string;
  nextAction: string;
};

export const operator = {
  name: "Greg",
  role: "Human owner / final approver",
  mission: "Sets strategy, approves external actions, and decides where capital and attention go.",
};

export const agents: AgentDefinition[] = [
  {
    id: "chief",
    name: "Chief",
    role: "AI Chief of Staff",
    mission: "Turns business goals into an ordered operating queue and keeps every agent focused on measurable outcomes.",
    status: "ready",
    autonomy: "execute-internal",
    cadence: "Every 15 minutes",
    lastTask: "Prioritized the Jacksonville lead-response queue",
    outputs: ["Daily priorities", "Blocked-task review", "Weekly scorecard"],
    approvalRequired: ["Budget changes", "Public commitments", "New integrations"],
  },
  {
    id: "scout",
    name: "Scout",
    role: "AI Lead Intelligence Analyst",
    mission: "Scores neighborhood conversations, removes seller/self-promo noise, and surfaces real homeowner buying intent.",
    status: "watching",
    autonomy: "execute-internal",
    cadence: "On every ingest",
    lastTask: "Separated service-offer posts from buyer-intent posts",
    outputs: ["Intent score", "Service classification", "Neighborhood match", "Urgency"],
    approvalRequired: [],
  },
  {
    id: "reply",
    name: "Reply",
    role: "AI Response Writer",
    mission: "Drafts fast, specific business replies for legitimate leads without impersonating residents or fabricating endorsements.",
    status: "ready",
    autonomy: "draft",
    cadence: "When a lead scores 75+",
    lastTask: "Drafted a paver-sealing response for a recommendation request",
    outputs: ["Business reply", "DM draft", "Follow-up message"],
    approvalRequired: ["Any external post", "Any direct message"],
  },
  {
    id: "growth",
    name: "Growth",
    role: "AI Growth Lead",
    mission: "Measures which services, neighborhoods, keywords, and channels produce revenue and proposes the next experiment.",
    status: "ready",
    autonomy: "execute-internal",
    cadence: "Daily",
    lastTask: "Compared paver-sealing and pressure-washing opportunity volume",
    outputs: ["Channel scorecard", "Experiment backlog", "CAC and conversion notes"],
    approvalRequired: ["Ad spend", "Promotions", "Outbound campaigns"],
  },
  {
    id: "sales",
    name: "Closer",
    role: "AI Sales Analyst",
    mission: "Reviews leads and outcomes, estimates job value, and recommends the fastest next step to move qualified prospects forward.",
    status: "ready",
    autonomy: "draft",
    cadence: "On lead-status change",
    lastTask: "Flagged high-value pool-deck and driveway opportunities",
    outputs: ["Lead value estimate", "Follow-up timing", "Objection notes"],
    approvalRequired: ["Pricing exceptions", "Customer-facing offers"],
  },
  {
    id: "product",
    name: "Builder",
    role: "AI Product Manager",
    mission: "Converts user pain, lead quality failures, and operator requests into small shippable product tasks.",
    status: "ready",
    autonomy: "execute-internal",
    cadence: "Daily",
    lastTask: "Moved intent filtering ahead of broad keyword expansion",
    outputs: ["Roadmap", "Acceptance criteria", "Release checklist"],
    approvalRequired: ["Major scope changes"],
  },
  {
    id: "dev",
    name: "Ship",
    role: "AI Senior Developer",
    mission: "Implements bounded product tasks, tests them, and prepares deployable changes with rollback notes.",
    status: "ready",
    autonomy: "execute-internal",
    cadence: "On approved task",
    lastTask: "Added the AI operating-team control plane",
    outputs: ["Code changes", "Tests", "Deployment notes"],
    approvalRequired: ["Production data mutation", "Breaking changes"],
  },
  {
    id: "seo",
    name: "Rank",
    role: "AI SEO / GEO Specialist",
    mission: "Tracks local search and AI-answer visibility, finds citation gaps, and proposes evidence-backed content improvements.",
    status: "ready",
    autonomy: "execute-internal",
    cadence: "Weekly",
    lastTask: "Built a Jacksonville AI-visibility benchmark plan",
    outputs: ["Prompt benchmark", "Citation gaps", "Schema/content recommendations"],
    approvalRequired: ["Publishing content", "Directory submissions"],
  },
  {
    id: "finance",
    name: "Ledger",
    role: "AI Financial Controller",
    mission: "Keeps the product profit-first by tracking recurring cost, lead value, payback, and proposed spend before money leaves the account.",
    status: "ready",
    autonomy: "observe",
    cadence: "Daily",
    lastTask: "Set a sub-$100 initial infrastructure target",
    outputs: ["Run-rate", "Spend warnings", "ROI estimate"],
    approvalRequired: ["All purchases", "Subscriptions", "Vendor contracts"],
  },
  {
    id: "security",
    name: "Guard",
    role: "AI Security & Trust Analyst",
    mission: "Reviews entry points, secrets, permissions, data handling, and trust-sensitive product behavior before release.",
    status: "watching",
    autonomy: "execute-internal",
    cadence: "On every release",
    lastTask: "Verified server-only Supabase secret handling",
    outputs: ["Security findings", "Trust checks", "Release blockers"],
    approvalRequired: ["Lowering a security control"],
  },
];

export const agentTasks: AgentTask[] = [
  {
    id: "task-intent-filter",
    agentId: "scout",
    title: "Reject seller/self-promotion posts before lead scoring",
    priority: "P0",
    state: "ready",
    trigger: "Keyword match contains first-person service-offer language",
    nextAction: "Add negative-intent features and regression fixtures",
  },
  {
    id: "task-fast-alert",
    agentId: "chief",
    title: "Create sub-2-minute high-intent alert path",
    priority: "P0",
    state: "queued",
    trigger: "Lead score >= 85",
    nextAction: "Connect approved SMS/email provider after operator selects channel",
  },
  {
    id: "task-reply-draft",
    agentId: "reply",
    title: "Generate service-specific response drafts",
    priority: "P1",
    state: "ready",
    trigger: "Qualified lead enters queue",
    nextAction: "Add templates for paver sealing, pressure washing, roof wash, and house wash",
  },
  {
    id: "task-source-quality",
    agentId: "growth",
    title: "Measure buyer-intent yield by source",
    priority: "P1",
    state: "ready",
    trigger: "Every 25 ingested conversations",
    nextAction: "Report qualified-lead rate for Nextdoor, Facebook, Reddit, and webhook sources",
  },
  {
    id: "task-paid-provider",
    agentId: "finance",
    title: "Compare build-vs-buy cost for neighborhood monitoring",
    priority: "P2",
    state: "queued",
    trigger: "Before adding a paid monitoring provider",
    nextAction: "Compare provider monthly cost to qualified lead volume and one-job payback",
  },
];

export function agentForTask(task: AgentTask) {
  return agents.find((agent) => agent.id === task.agentId);
}
