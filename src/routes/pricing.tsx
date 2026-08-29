import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Code2,
  FileCheck2,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { InstallChip } from "@/components/InstallChip";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Launch Pricing — EazyDataFix" },
      {
        name: "description",
        content:
          "Start free with the EazyDataFix browser preview, use the open-source Python engine, or validate a real business workflow through a 30-day assisted pilot.",
      },
      { property: "og:title", content: "EazyDataFix Launch Pricing" },
      {
        property: "og:description",
        content: "Free preview, open-source engine and a focused 30-day assisted team pilot.",
      },
    ],
    links: [{ rel: "canonical", href: "https://eazydatafix.com/pricing" }],
  }),
  component: Pricing,
});

const plans = [
  {
    name: "Studio Preview",
    eyebrow: "Try the workflow",
    price: "₹0",
    suffix: "free",
    description:
      "A browser-local CSV experience for understanding how EazyDataFix finds and reviews issues.",
    icon: Sparkles,
    features: [
      "Use a sample or your own CSV",
      "Up to 2 MB in the public preview",
      "Choose deterministic fix groups",
      "Compare original and clean output",
      "Download the preview CSV",
    ],
    cta: "Open free preview",
    to: "/studio" as const,
    featured: false,
  },
  {
    name: "Assisted Team Pilot",
    eyebrow: "Validate business value",
    price: "₹25,000",
    suffix: "30 days",
    description:
      "One focused workflow configured and measured with your reporting or analytics team.",
    icon: Users,
    features: [
      "One agreed CSV/Excel workflow",
      "Up to three reusable cleaning recipes",
      "Analysis or Power BI readiness reports",
      "Weekly working review",
      "Final time-saved and error report",
      "Pilot fee credited toward an eligible annual plan",
    ],
    cta: "Review pilot scope",
    to: "/pricing" as const,
    hash: "pilot-scope",
    featured: true,
  },
  {
    name: "Open-source Engine",
    eyebrow: "For Python teams",
    price: "₹0",
    suffix: "MIT licence",
    description:
      "Install the production engine and integrate deterministic readiness workflows in your own code.",
    icon: Code2,
    features: [
      "EazyDataFix v1.4.0",
      "Analysis Ready workflow",
      "Leakage-safe ML Ready workflow",
      "Power BI Ready workflow",
      "Auditable reports and change logs",
    ],
    cta: "Read developer docs",
    to: "/docs" as const,
    featured: false,
  },
];

function Pricing() {
  return (
    <div>
      <section className="border-b border-border bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-medium text-cyan-100">
            <ShieldCheck className="h-3.5 w-3.5" /> Honest launch pricing
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Prove value before buying more software.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            The preview is free. The Python engine stays open source. Businesses pay when we
            configure a repeatable workflow, support the team and measure the operational outcome.
          </p>
        </div>
      </section>

      <section className="bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18">
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <article
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border p-6 sm:p-7 ${
                    plan.featured
                      ? "border-accent bg-card shadow-xl shadow-accent/10"
                      : "border-border bg-card"
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-foreground">
                      First revenue offer
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {plan.eyebrow}
                    </span>
                  </div>
                  <h2 className="mt-6 text-xl font-semibold">{plan.name}</h2>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
                    <span className="pb-1 text-xs text-muted-foreground">/ {plan.suffix}</span>
                  </div>
                  <p className="mt-4 min-h-18 text-sm leading-6 text-muted-foreground">
                    {plan.description}
                  </p>
                  <ul className="mt-6 flex-1 space-y-3 border-t border-border pt-6 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={plan.to}
                    hash={plan.hash}
                    className={`mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold ${
                      plan.featured
                        ? "bg-foreground text-background"
                        : "border border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {plan.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background">
                    <Code2 className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-semibold">Prefer code?</div>
                    <div className="text-sm text-muted-foreground">
                      Install the open-source engine.
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/35 p-4">
                <InstallChip />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pilot-scope" className="border-y border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              What ₹25,000 buys
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              A measured pilot—not a software promise.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              The pilot starts with one repetitive data-preparation job. We configure it, run it
              with the team and finish with evidence showing whether EazyDataFix deserves a larger
              rollout.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [
                "Week 1",
                "Workflow baseline",
                "Select the file flow, document current effort and agree the success measure.",
              ],
              [
                "Week 2",
                "Recipe configuration",
                "Configure deterministic rules, warnings, approvals and the desired export package.",
              ],
              [
                "Week 3",
                "Team usage",
                "Run real files, capture edge cases and improve the workflow without hiding failures.",
              ],
              [
                "Week 4",
                "Outcome review",
                "Compare time, errors and repeatability, then decide whether to continue.",
              ],
            ].map(([week, title, text]) => (
              <article key={week} className="rounded-xl border border-border bg-card p-5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-accent">
                  {week}
                </div>
                <h3 className="mt-2 font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="text-center">
            <HelpCircle className="mx-auto h-7 w-7 text-accent" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">Before a business pays</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              We should be clear about what the current product does and does not include.
            </p>
          </div>
          <div className="mt-8 space-y-3">
            {[
              [
                "Is the public Studio the full SaaS?",
                "No. It is a working browser preview for CSV. The v1.4.0 Python engine contains the deeper Analysis Ready, ML Ready and Power BI Ready workflows.",
              ],
              [
                "Does the pilot include unlimited integrations?",
                "No. The ₹25,000 pilot covers one agreed workflow and up to three reusable recipes. Databases and enterprise connectors are outside the launch scope.",
              ],
              [
                "Will AI automatically rewrite our data?",
                "No. Deterministic rules generate the proposed transformations. Customers review what changes before exporting the result.",
              ],
              [
                "Is a subscription required after the pilot?",
                "No. The final review is a go/no-go decision based on measured value. Continued pricing is agreed only if the workflow proves useful.",
              ],
            ].map(([question, answer]) => (
              <details key={question} className="group rounded-xl border border-border bg-card p-5">
                <summary className="cursor-pointer list-none font-medium">
                  <span className="flex items-center justify-between gap-4">
                    {question}
                    <span className="text-accent transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 border-t border-border pt-3 text-sm leading-6 text-muted-foreground">
                  {answer}
                </p>
              </details>
            ))}
          </div>
          <div className="mt-10 rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
                  <FileCheck2 className="h-4 w-4" /> Start with proof
                </div>
                <h2 className="mt-3 text-2xl font-semibold">
                  Try the workflow before discussing a pilot.
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Use the included sample or a non-sensitive CSV.
                </p>
              </div>
              <Link
                to="/studio"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 text-sm font-semibold text-slate-950"
              >
                Open Data Studio <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
