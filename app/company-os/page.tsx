import Link from "next/link";
import { AITeam, AgentOps } from "@/components/ai-operations";

export const metadata = {
  title: "Company OS | Neighborhood Signal",
  description: "AI-native operating control plane for Neighborhood Signal.",
};

export default function CompanyOSPage() {
  return (
    <main className="company-os-page">
      <header className="company-os-header">
        <div>
          <p className="eyebrow">Neighborhood Signal · Company OS</p>
          <h1>Profit-first AI operations</h1>
          <p className="company-os-subtitle">A small, bounded agent team operating one product with one human owner and explicit approval gates.</p>
        </div>
        <Link className="ghost-button" href="/">← Lead intelligence</Link>
      </header>
      <AITeam />
      <div className="company-os-divider" />
      <AgentOps />
    </main>
  );
}
