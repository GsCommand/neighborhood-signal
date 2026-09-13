import Link from "next/link";
import { AITeam, AgentOps } from "@/components/ai-operations";

export const metadata = {
  title: "Company OS | Neighborhood Signal",
  description: "AI-native operating control plane for Neighborhood Signal.",
};

export default function CompanyOSPage() {
  return (
    <main className="main">
      <header className="topbar">
        <div>
          <p className="eyebrow">Neighborhood Signal · Company OS</p>
          <h1>Profit-first AI operations</h1>
        </div>
        <div className="top-actions"><Link className="ghost-button" href="/">← Lead intelligence</Link></div>
      </header>
      <AITeam />
      <div style={{ height: 24 }} />
      <AgentOps />
    </main>
  );
}
