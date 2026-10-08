"use client";

import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  GitBranch,
  PlusCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  GridStatusIndicator,
  OperationalMetric,
  SystemEventFeed,
  TelemetryRow,
} from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  useAuditLogs,
  useAuth,
  useOperationalAnalytics,
  useOutages,
  useSchedules,
} from "@/hooks";
import { asCount } from "@/lib/analytics";
import {
  outageBadgeVariant,
  scheduleBadgeVariant,
} from "@/lib/status-variants";

export default function OperatorDashboard() {
  const { isLoading } = useAuth();
  const { data: analytics, isLoading: analyticsLoading } =
    useOperationalAnalytics();
  const { data: outages } = useOutages({ limit: 5 });
  const { data: schedules } = useSchedules({ limit: 5 });
  const { data: activity } = useAuditLogs({ limit: 6 });

  const activeOutages = analytics?.data?.activeOutages ?? 0;
  const criticalFeedersDown = asCount(analytics?.data?.criticalFeedersDown);

  // Derive an honest grid-health state from real telemetry.
  const gridStatus =
    criticalFeedersDown > 0
      ? "critical"
      : activeOutages > 0
        ? "warning"
        : "operational";

  if (isLoading || analyticsLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border bg-card p-6"
            >
              <div className="mb-2 h-4 w-1/4 rounded bg-muted" />
              <div className="h-8 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Page header + live grid-health indicator */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Operator Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Operational overview of grid status, outages, and schedules.
          </p>
        </div>
        <GridStatusIndicator
          status={gridStatus}
          label={
            gridStatus === "critical"
              ? "Critical feeders down"
              : gridStatus === "warning"
                ? "Active outages"
                : "Grid operational"
          }
        />
      </div>

      {/* KPI metrics */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OperationalMetric
          label="Active Outages"
          value={activeOutages}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <OperationalMetric
          label="Priority Outages"
          value={analytics?.data?.priorityOutages ?? 0}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <OperationalMetric
          label="Available Technicians"
          value={`${asCount(analytics?.data?.availableTechnicians)} / ${analytics?.data?.totalTechnicians ?? 0}`}
          icon={<Users className="h-5 w-5" />}
        />
        <OperationalMetric
          label="Active Schedules"
          value={analytics?.data?.activeSchedules ?? 0}
          icon={<Calendar className="h-5 w-5" />}
        />
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {/* Quick actions */}
        <div className="rounded-xl border bg-card p-6">
          <CardTitle className="mb-4 text-xl">Quick Actions</CardTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/operator/outages">
              <Button className="h-14 w-full justify-start gap-3">
                <AlertTriangle className="h-5 w-5" />
                Manage Outages
              </Button>
            </Link>
            <Link href="/operator/schedules/create">
              <Button className="h-14 w-full justify-start gap-3">
                <PlusCircle className="h-5 w-5" />
                Create Schedule
              </Button>
            </Link>
            <Link href="/operator/grid">
              <Button
                variant="outline"
                className="h-14 w-full justify-start gap-3"
              >
                <GitBranch className="h-5 w-5" />
                Manage Grid
              </Button>
            </Link>
            <Link href="/operator/applications">
              <Button
                variant="outline"
                className="h-14 w-full justify-start gap-3"
              >
                <Users className="h-5 w-5" />
                Review Applications
              </Button>
            </Link>
          </div>
        </div>

        {/* Critical feeders */}
        <div className="rounded-xl border bg-card p-6">
          <CardTitle className="mb-4 text-xl">Critical Feeders</CardTitle>
          <div className="space-y-3">
            {criticalFeedersDown > 0 ? (
              <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <GridStatusIndicator
                  status="critical"
                  label={`${criticalFeedersDown} critical feeder(s) down`}
                />
                <Link
                  href="/operator/grid"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Inspect <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-emerald/20 bg-emerald/5 p-4">
                <GridStatusIndicator
                  status="operational"
                  label="All feeders nominal"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {/* Recent outages */}
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle className="text-xl">Recent Outages</CardTitle>
            <Link
              href="/operator/outages"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {outages?.data?.length ? (
              outages.data.slice(0, 5).map((outage) => (
                <div
                  key={outage.id}
                  className="flex items-center justify-between gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={outageBadgeVariant(outage.status)}>
                      {outage.status}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">
                        Outage #{outage.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {outage.area?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/operator/outage?id=${outage.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Manage
                  </Link>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-muted-foreground">
                No recent outages
              </p>
            )}
          </div>
        </div>

        {/* Upcoming schedules */}
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle className="text-xl">Upcoming Schedules</CardTitle>
            <Link
              href="/operator/schedules"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {schedules?.data?.length ? (
              schedules.data.slice(0, 5).map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{schedule.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(schedule.startTime).toLocaleDateString()} -{" "}
                      {new Date(schedule.endTime).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={scheduleBadgeVariant(schedule.status)}>
                    {schedule.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-muted-foreground">
                No upcoming schedules
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Operational analytics + recent activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <CardTitle className="mb-4 text-xl">Operational Analytics</CardTitle>
          <div className="grid gap-x-8 gap-y-1 md:grid-cols-2">
            <TelemetryRow
              label="MTTR"
              value={analytics?.data?.mttr ?? 0}
              unit="h"
            />
            <TelemetryRow
              label="Avg Assignment"
              value={analytics?.data?.avgAssignmentTime ?? 0}
              unit="h"
            />
            <TelemetryRow
              label="First-Time Fix"
              value={analytics?.data?.firstTimeFixRate ?? 0}
              unit="%"
            />
            <TelemetryRow
              label="Critical Feeders"
              value={criticalFeedersDown}
              status={criticalFeedersDown > 0 ? "critical" : "operational"}
            />
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <CardTitle className="mb-4 text-xl">Recent Activity</CardTitle>
          <SystemEventFeed
            events={(activity?.data ?? []).map((log) => ({
              id: log.id,
              action: log.action,
              entity: log.entity,
              entityId: log.entityId,
              actorName: log.actor?.name,
              createdAt: log.createdAt,
            }))}
            viewAllHref="/operator/audit-logs"
            viewAllLabel="View audit trail"
          />
        </div>
      </div>
    </div>
  );
}
