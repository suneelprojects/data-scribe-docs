import type { LucideIcon } from "lucide-react";
import {
  Box,
  Cloud,
  Code2,
  Database,
  Package,
  Sparkles,
  Terminal,
  Users,
} from "lucide-react";

export type EcosystemGroup = {
  label: string;
  items: {
    name: string;
    description: string;
    status: "Available" | "Coming Soon" | "Planned";
    icon: LucideIcon;
  }[];
};

export const ecosystem: EcosystemGroup[] = [
  {
    label: "Core",
    items: [
      { name: "Python Library", description: "The pip-installable core.", status: "Available", icon: Package },
      { name: "CLI Tool", description: "edf assess / edf fix from your terminal.", status: "Coming Soon", icon: Terminal },
      { name: "REST API", description: "Assess and fix datasets over HTTP.", status: "Planned", icon: Code2 },
    ],
  },
  {
    label: "Developer Tools",
    items: [
      { name: "VS Code Extension", description: "Inline assessments and quick fixes.", status: "Planned", icon: Box },
      { name: "AI Assistant", description: "Natural-language cleaning recommendations.", status: "Planned", icon: Sparkles },
    ],
  },
  {
    label: "Cloud & Enterprise",
    items: [
      { name: "Web Application", description: "Hosted UI for teams.", status: "Planned", icon: Cloud },
      { name: "Enterprise Edition", description: "SSO, audit logs, Spark connectors.", status: "Planned", icon: Database },
    ],
  },
  {
    label: "Community",
    items: [
      { name: "Community", description: "Forums, plugins and integrations.", status: "Coming Soon", icon: Users },
    ],
  },
];
