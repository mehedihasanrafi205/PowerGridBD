"use client";

import { AuditLogExplorer } from "@/components/dashboard";

export default function OperatorAuditLogsPage() {
  return (
    <AuditLogExplorer
      title="Audit Logs"
      description="System activity trail for operational oversight."
    />
  );
}
