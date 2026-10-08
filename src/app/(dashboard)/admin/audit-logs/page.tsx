"use client";

import { AuditLogExplorer } from "@/components/dashboard";

export default function AdminAuditLogsPage() {
  return (
    <AuditLogExplorer
      title="System Audit Logs"
      description="Complete system activity trail for compliance and debugging."
    />
  );
}
