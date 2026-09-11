"use client";

import { useMemo, useState } from "react";
import { customers, keywords, leads, territories } from "@/lib/demo-data";
import type { Lead } from "@/lib/types";

const tabs = ["Overview", "Lead Feed", "Customers", "Territories", "Keywords", "Integrations"] as const;
type Tab = (typeof tabs)[number];

export function Dashboard() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [selectedLead, setSelectedLead] = useState<Lead>(leads[0]);
  const [query, setQuery] = useState("");

  const filteredLeads = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return leads;
    return leads.filter((lead) => [lead.text, lead.neighborhood, lead.city, lead.service, lead.source].join(" ").toLowerCase().includes(q));
  }, [query]);

  const highIntent = leads.filter((lead) => lead.score >= 90).length;
  const recommendationRequests = leads.filter((lead) => lead.recommendationIntent).length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">NS</div>
          <div><strong>Neighborhood Signal</strong><span>Local intent intelligence</span></div>
        </div>
        <nav className="nav-list">
          {tabs.map((item) => (
            <button className={tab === item ? "nav-item active" : "nav-item"} key={item} onClick={() => setTab(item)}>
              <span>{navIcon(item)}</span>{item}
            </button>
          ))}
        </nav>
        <div className="sidebar-card">
          <div className="pulse-row"><span className="pulse" /> Monitoring active</div>
          <strong>6 territories</strong>
          <p>Manual + webhook ingestion are ready. External connectors can attach to the same pipeline.</p>
        </div>
        <div className="workspace"><span>HS</span><div><strong>HydroSeal Demo</strong><small>Jacksonville market</small></div></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Neighborhood intelligence</p>
            <h1>{tab}</h1>
          </div>
          <div className="top-actions"><button className="ghost-button">Last 24 hours</button><button className="primary-button" onClick={() => setTab("Lead Feed")}>View live leads</button></div>
        </header>

        {tab === "Overview" && <Overview onLeadClick={(lead) => { setSelectedLead(lead); setTab("Lead Feed"); }} highIntent={highIntent} recommendationRequests={recommendationRequests} />}
        {tab === "Lead Feed" && <LeadFeed leads={filteredLeads} selected={selectedLead} setSelected={setSelectedLead} query={query} setQuery={setQuery} />}
        {tab === "Customers" && <Customers />}
        {tab === "Territories" && <Territories />}
        {tab === "Keywords" && <Keywords />}
        {tab === "Integrations" && <Integrations />}
      </main>
    </div>
  );
}

function Overview({ onLeadClick, highIntent, recommendationRequests }: { onLeadClick: (lead: Lead) => void; highIntent: number; recommendationRequests: number }) {
  const stats = [
    ["Relevant conversations", "64", "+18%", "Detected across active sources"],
    ["High-intent leads", String(highIntent), "+2 today", "90+ intent score"],
    ["Recommendation asks", String(recommendationRequests), "60%", "Explicit vendor recommendation"],
    ["Matched customers", "4", "3 neighborhoods", "Past customers near active leads"],
  ];
  return <>
    <section className="hero-card">
      <div><span className="status-pill">● Live market</span><h2>Know when a homeowner is asking for your service.</h2><p>Neighborhood Signal separates real buying intent from neighborhood chatter, then shows the best response path — including legitimate past customers nearby.</p></div>
      <div className="hero-score"><small>Hottest lead</small><strong>97</strong><span>/100 intent</span></div>
    </section>
    <section className="stats-grid">{stats.map(([label, value, delta, note]) => <article className="stat-card" key={label}><div className="stat-head"><span>{label}</span><em>{delta}</em></div><strong>{value}</strong><p>{note}</p></article>)}</section>
    <section className="content-grid">
      <div className="panel">
        <div className="panel-head"><div><p className="eyebrow">Priority queue</p><h3>Best opportunities right now</h3></div><span className="muted">Intent ≥ 79</span></div>
        <div className="lead-list">{leads.slice(0,4).map((lead) => <LeadRow key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />)}</div>
      </div>
      <div className="panel signal-panel">
        <div className="panel-head"><div><p className="eyebrow">Signal quality</p><h3>Why this works</h3></div></div>
        <div className="signal-bars">
          <Signal label="Exact service match" value={94} />
          <Signal label="Buying language" value={88} />
          <Signal label="Recommendation intent" value={82} />
          <Signal label="Territory confidence" value={91} />
        </div>
        <div className="guardrail"><strong>Trust guardrail</strong><p>Customer outreach is only suggested when the customer is a genuine past client. No fabricated endorsements or neighbor impersonation.</p></div>
      </div>
    </section>
  </>;
}

function LeadFeed({ leads, selected, setSelected, query, setQuery }: { leads: Lead[]; selected: Lead; setSelected: (lead: Lead) => void; query: string; setQuery: (value: string) => void }) {
  const matches = customers.filter((c) => c.recommendable && (c.neighborhood === selected.neighborhood || c.city === selected.city));
  return <section className="lead-workspace">
    <div className="panel lead-column">
      <div className="search-row"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search service, neighborhood, source…" /><span>{leads.length} leads</span></div>
      <div className="lead-list scroll">{leads.map((lead) => <LeadRow key={lead.id} lead={lead} onClick={() => setSelected(lead)} selected={selected.id === lead.id} />)}</div>
    </div>
    <div className="panel detail-column">
      <div className="detail-top"><div><span className={`score score-${scoreBand(selected.score)}`}>{selected.score}</span><span className="source-pill">{selected.source}</span></div><span className={`urgency ${selected.urgency}`}>{selected.urgency} urgency</span></div>
      <p className="eyebrow">{selected.neighborhood} · {selected.city}</p>
      <h2>{selected.service}</h2>
      <blockquote>“{selected.text}”</blockquote>
      <div className="reason-grid">{selected.reasons.map((reason) => <span key={reason}>✓ {reason}</span>)}</div>
      <div className="detail-section"><div className="section-title"><h3>Recommended response</h3><span>Business reply</span></div><div className="draft">Hi — we specialize in {selected.service.toLowerCase()} in {selected.neighborhood}. Happy to take a look and explain the right cleaning, joint-sand and sealing approach for the surface. If you'd like, send over a photo or approximate square footage and we can point you in the right direction.</div><button className="secondary-button">Copy response</button></div>
      <div className="detail-section"><div className="section-title"><h3>Past-customer match</h3><span>{matches.length} eligible</span></div>{matches.length ? matches.map((customer) => <div className="customer-match" key={customer.id}><div className="avatar">{customer.name.split(" ").slice(-1)[0][0]}</div><div><strong>{customer.name}</strong><p>{customer.neighborhood} · {customer.service}</p></div><button className="ghost-button small">Prepare outreach</button></div>) : <p className="muted">No recommendable past customer matched this neighborhood yet.</p>}<p className="compliance-note">Only ask a real past customer to share their genuine experience. Do not script or require a positive endorsement.</p></div>
    </div>
  </section>;
}

function Customers() {
  return <section className="panel"><div className="panel-head"><div><p className="eyebrow">Customer network</p><h3>Past customers by neighborhood</h3></div><button className="primary-button">Import CSV</button></div><div className="table-wrap"><table><thead><tr><th>Customer</th><th>Neighborhood</th><th>Service</th><th>Completed</th><th>Recommendation</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.id}><td><strong>{customer.name}</strong></td><td>{customer.neighborhood}</td><td>{customer.service}</td><td>{customer.completedAt}</td><td><span className={customer.recommendable ? "badge good" : "badge"}>{customer.recommendable ? "Eligible" : "Do not ask"}</span></td></tr>)}</tbody></table></div></section>;
}

function Territories() {
  return <section className="cards-grid">{territories.map((territory) => <article className="panel territory-card" key={territory.name}><div className="territory-top"><span className="territory-pin">⌖</span><span className="status-pill">● Active</span></div><h3>{territory.name}</h3><p>{territory.city}</p><div className="chip-row">{territory.services.map((s) => <span className="chip" key={s}>{s}</span>)}</div><div className="territory-footer"><span>Radius & keyword rules</span><button className="ghost-button small">Edit</button></div></article>)}</section>;
}

function Keywords() {
  return <section className="panel"><div className="panel-head"><div><p className="eyebrow">Intent dictionary</p><h3>Services + buying phrases</h3></div><button className="primary-button">Add keyword</button></div><div className="keyword-cloud">{keywords.map((keyword, index) => <div className="keyword-card" key={keyword}><span>{index < 6 ? "Service" : "Intent"}</span><strong>{keyword}</strong><em>{index < 6 ? "High weight" : "Intent multiplier"}</em></div>)}</div></section>;
}

function Integrations() {
  const integrations = [
    ["Webhook / API", "Active", "POST conversations directly into the scoring pipeline.", "good"],
    ["Manual capture", "Active", "Paste a neighborhood post into the system for immediate scoring.", "good"],
    ["Nextdoor", "API access required", "Connector boundary is ready; use approved API access when available.", "warn"],
    ["Facebook Groups", "Connector required", "Attach approved data access or a compliant monitoring provider.", "warn"],
    ["Reddit", "Ready to connect", "Public discussion monitoring can attach to the same ingest contract.", "neutral"],
  ];
  return <section className="integration-grid">{integrations.map(([name, state, description, tone]) => <article className="panel integration-card" key={name}><div className="integration-head"><div className="integration-logo">{name[0]}</div><span className={`badge ${tone}`}>{state}</span></div><h3>{name}</h3><p>{description}</p><button className="ghost-button">Configure</button></article>)}</section>;
}

function LeadRow({ lead, onClick, selected = false }: { lead: Lead; onClick: () => void; selected?: boolean }) {
  return <button className={selected ? "lead-row selected" : "lead-row"} onClick={onClick}><span className={`score score-${scoreBand(lead.score)}`}>{lead.score}</span><div className="lead-copy"><div><strong>{lead.service}</strong><span className="source-pill">{lead.source}</span></div><p>{lead.text}</p><small>{lead.neighborhood} · {lead.estimatedValue}</small></div><span className="arrow">›</span></button>;
}

function Signal({ label, value }: { label: string; value: number }) {
  return <div className="signal"><div><span>{label}</span><strong>{value}%</strong></div><div className="bar"><i style={{ width: `${value}%` }} /></div></div>;
}

function scoreBand(score: number) { return score >= 90 ? "hot" : score >= 75 ? "warm" : "cool"; }
function navIcon(tab: Tab) { return ({ Overview: "◫", "Lead Feed": "⌁", Customers: "◎", Territories: "⌖", Keywords: "#", Integrations: "↗" } as Record<Tab, string>)[tab]; }
