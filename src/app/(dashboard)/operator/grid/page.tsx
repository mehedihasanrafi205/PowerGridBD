"use client";

import { GitBranch } from "lucide-react";
import { GridHierarchyExplorer, PageHeader } from "@/components/dashboard";
import {
  useAreas,
  useAuth,
  useFeeders,
  useSubstations,
  useZones,
} from "@/hooks";

export default function OperatorGridPage() {
  const { isLoading: authLoading } = useAuth();

  const { data: zones, isLoading: zonesLoading } = useZones();
  const { data: substations, isLoading: substationsLoading } = useSubstations();
  const { data: feeders, isLoading: feedersLoading } = useFeeders();
  const { data: areas, isLoading: areasLoading } = useAreas();

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 rounded bg-muted" />
          <div className="h-64 rounded bg-muted" />
        </div>
      </div>
    );
  }

  const loading =
    zonesLoading || substationsLoading || feedersLoading || areasLoading;

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Grid Management"
        description="Grid hierarchy: Zones → Substations → Feeders → Areas"
        status={
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="h-4 w-4 text-primary" aria-hidden="true" />
            Read-only operational view
          </span>
        }
      />

      <GridHierarchyExplorer
        zones={zones?.data}
        substations={substations?.data}
        feeders={feeders?.data}
        areas={areas?.data}
        loading={loading}
      />
    </div>
  );
}
