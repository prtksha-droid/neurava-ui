import {
  MessageSquare,
  Shield,
  Eye,
  Bell,
  FileText,
  AlertTriangle,
  Lock,
  Users,
  Database,
  Tags,
  GitBranch,
  CheckCircle,
  ShieldCheck,
  UserCheck,
  Clock,
  Workflow,
  Plug,
} from "lucide-react";

export const aiTrustMenu = [
  { label: "Chat", icon: MessageSquare, key: "chat" },
  { label: "Guardrails", icon: Shield, key: "guardrails" },
  { label: "Observability", icon: Eye, key: "observability" },
  { label: "Alerts", icon: Bell, key: "alerts" },
  { label: "Analytics", icon: FileText, key: "analytics" },
  { label: "Attack Lab", icon: AlertTriangle, key: "attack-lab" },
  { label: "Consent", icon: Lock, key: "consent", admin: true },
  { label: "Users", icon: Users, key: "users", admin: true },
];

export const dataGovernanceMenu = [
  { label: "Data Inventory", key: "data-inventory", icon: Database },
  { label: "Metadata Management", key: "metadata-management", icon: Tags },
  { label: "Data Lineage", key: "data-lineage", icon: GitBranch },
  { label: "Data Quality", key: "data-quality", icon: CheckCircle },
  { label: "DPDP Compliance", key: "dpdp-compliance", icon: ShieldCheck },
  {
    label: "Data Subject Rights",
    key: "data-subject-rights",
    icon: UserCheck,
  },
  { label: "Retention Policies", key: "retention-policies", icon: Clock },
];

export const operationsMenu = [
  { label: "Workflows", key: "workflows", icon: Workflow },
  { label: "Integrations", key: "integrations", icon: Plug },
  { label: "Reports", key: "reports", icon: FileText },
];