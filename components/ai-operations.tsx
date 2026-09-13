"use client";

import { agentForTask, agents, agentTasks, operator } from "@/lib/agent-team";

export function AITeam() {
  const active = agents.filter((agent) => agent.status !== "blocked").length;
  const internalAutonomy = agents.filter((agent) => agent.autonomy === "execute-internal").length;

  return (
    <>
      <section className="hero-card">
        <div>
          <span className="status-pill">● AI-native operating model</span>
          <h2>One human owner. A small agent team. Every role tied to an outcome.</h2>
          <p>
            Neighborhood Signal is being run as a profit-first software product: agents can observe, analyze, draft, and execute internal work, while external posts, spend, customer promises, and trust-sensitive actions remain human-approved.
          </p>
        </div>
        <div className="hero-score"><small>Agents ready</small><strong>{active}</strong><span>/{agents.length} online</span></div>
      </section>

      <section className="stats-grid">
        <article className="stat-card"><div className="stat-head"><span>Human operators</span><em>Final authority</em></div><strong>1</strong><p>{operator.name} owns strategy, money, and external approvals.</p></article>
        <article className="stat-card"><div className="stat-head"><span>Internal-autonomy agents</span><em>Bounded</em></div><strong>{internalAutonomy}</strong><p>Can perform analysis and internal product work without publishing externally.</p></article>
        <article className="stat-card"><div className="stat-head"><span>External auto-posting</span><em>Guardrail</em></div><strong>0</strong><p>No fake neighbor accounts, fabricated endorsements, or unattended third-party posting.</p></article>
        <article className="stat-card"><div className="stat-head"><span>Initial infra target</span><em>Profit first</em></div><strong>&lt;$100</strong><p>Use free tiers and small paid services until revenue proves the next expense.</p></article>
      </section>

      <section className="cards-grid">
        <article className="panel territory-card">
          <div className="territory-top"><span className="territory-pin">G</span><span className="badge good">Human</span></div>
          <h3>{operator.name}</h3>
          <p>{operator.role}</p>
          <div className="chip-row"><span className="chip">Approves spend</span><span className="chip">Approves public actions</span><span className="chip">Sets direction</span></div>
          <div className="territory-footer"><span>{operator.mission}</span></div>
        </article>

        {agents.map((agent) => (
          <article className="panel territory-card" key={agent.id}>
            <div className="territory-top">
              <span className="territory-pin">{agent.name.slice(0, 2).toUpperCase()}</span>
              <span className={`badge ${agent.status === "ready" ? "good" : agent.status === "watching" ? "neutral" : "warn"}`}>{agent.status}</span>
            </div>
            <h3>{agent.name}</h3>
            <p>{agent.role}</p>
            <div className="chip-row"><span className="chip">{agent.cadence}</span><span className="chip">{autonomyLabel(agent.autonomy)}</span></div>
            <div className="territory-footer"><span>{agent.lastTask}</span></div>
          </article>
        ))}
      </section>
    </>
  );
}

export function AgentOps() {
  const p0 = agentTasks.filter((task) => task.priority === "P0").length;
  const blocked = agentTasks.filter((task) => task.state === "blocked").length;

  return (
    <>
      <section className="stats-grid">
        <article className="stat-card"><div className="stat-head"><span>Open agent tasks</span><em>Queue</em></div><strong>{agentTasks.length}</strong><p>Bounded work items with explicit triggers and next actions.</p></article>
        <article className="stat-card"><div className="stat-head"><span>P0 tasks</span><em>Do first</em></div><strong>{p0}</strong><p>Lead-quality and response-speed work outranks cosmetic expansion.</p></article>
        <article className="stat-card"><div className="stat-head"><span>Blocked</span><em>Needs owner</em></div><strong>{blocked}</strong><p>Tasks block only when a dependency or human approval is actually required.</p></article>
        <article className="stat-card"><div className="stat-head"><span>Trust mode</span><em>Enforced</em></div><strong>Human</strong><p>Outbound messages, spend, and third-party actions require operator approval.</p></article>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div><p className="eyebrow">Agent operating queue</p><h3>What the company should work on next</h3></div>
          <span className="muted">Profit-first priority order</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Priority</th><th>Agent</th><th>Task</th><th>Trigger</th><th>Next action</th><th>State</th></tr></thead>
            <tbody>
              {agentTasks.map((task) => {
                const agent = agentForTask(task);
                return (
                  <tr key={task.id}>
                    <td><span className={task.priority === "P0" ? "badge warn" : "badge neutral"}>{task.priority}</span></td>
                    <td><strong>{agent?.name || task.agentId}</strong><div className="muted">{agent?.role}</div></td>
                    <td>{task.title}</td>
                    <td>{task.trigger}</td>
                    <td>{task.nextAction}</td>
                    <td><span className={`badge ${task.state === "ready" ? "good" : task.state === "blocked" ? "warn" : "neutral"}`}>{task.state}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-grid" style={{ marginTop: 14 }}>
        <div className="panel">
          <div className="panel-head"><div><p className="eyebrow">Autonomy policy</p><h3>What agents can do alone</h3></div></div>
          <div className="signal-bars">
            <div className="guardrail"><strong>Observe</strong><p>Read product data, health status, lead metrics, and approved public information.</p></div>
            <div className="guardrail"><strong>Analyze</strong><p>Classify, score, compare, summarize, prioritize, and identify anomalies.</p></div>
            <div className="guardrail"><strong>Draft</strong><p>Prepare code, content, replies, offers, and reports for review.</p></div>
            <div className="guardrail"><strong>Execute internally</strong><p>Run bounded tests, update internal queues, and perform reversible product work.</p></div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div><p className="eyebrow">Hard approval gates</p><h3>What stays human-controlled</h3></div></div>
          <div className="signal-bars">
            <div className="guardrail"><strong>Money</strong><p>Purchases, subscriptions, pricing exceptions, and ad budgets.</p></div>
            <div className="guardrail"><strong>External identity</strong><p>No fake accounts, fake recommendations, or neighbor impersonation.</p></div>
            <div className="guardrail"><strong>Publishing</strong><p>Third-party posts, DMs, campaigns, and customer-facing commitments.</p></div>
            <div className="guardrail"><strong>Risk</strong><p>Production data mutation, lowered security controls, and irreversible actions.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}

function autonomyLabel(value: "observe" | "draft" | "execute-internal") {
  if (value === "execute-internal") return "Internal execution";
  if (value === "draft") return "Draft only";
  return "Observe only";
}
