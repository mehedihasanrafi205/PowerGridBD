"use client";

import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  EmptyState,
  OperationalMetric,
  PageHeader,
  TelemetryRow,
} from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { useAuth, useOutages, useTechnicianSummary } from "@/hooks";

/** Map outage status to a semantic Badge variant. */
function outageVariant(status: string) {
  if (status === "ASSIGNED") return "info" as const;
  if (status === "IN_PROGRESS") return "default" as const;
  return "success" as const;
}

export default function TechnicianDashboard() {
  const { user, isLoading } = useAuth();
  const { data: summary, isLoading: summaryLoading } = useTechnicianSummary();
  const { data: outages, isLoading: outagesLoading } = useOutages({
    status: ["ASSIGNED", "IN_PROGRESS"],
    limit: 5,
  });

  if (isLoading || summaryLoading) {
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

  const fixRate = summary?.data?.firstTimeFixRate || 0;
  const avgResolution = summary?.data?.avgResolutionTime || 0;

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0]}!`}
        description="Here's your task overview and performance summary."
        actions={
          <Link href="/technician/outages">
            <Button>View All Assigned</Button>
          </Link>
        }
        status={
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span className="font-mono tabular-nums">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span aria-hidden="true">•</span>
            <span className="font-mono tabular-nums">
              {summary?.data?.assignedCount || 0} assigned
            </span>
            <span aria-hidden="true">•</span>
            <span className="font-mono tabular-nums">
              {summary?.data?.ongoingCount || 0} in progress
            </span>
          </span>
        }
      />

      {/* KPI metrics */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OperationalMetric
          label="Assigned Tasks"
          value={summary?.data?.assignedCount || 0}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <OperationalMetric
          label="In Progress"
          value={summary?.data?.ongoingCount || 0}
          icon={<Clock className="h-5 w-5" />}
        />
        <OperationalMetric
          label="Resolved This Month"
          value={summary?.data?.resolvedCount || 0}
          icon={<CheckCircle className="h-5 w-5" />}
          delta="Completed"
        />
        <OperationalMetric
          label="Avg Resolution Time"
          value={`${avgResolution}h`}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Assigned outages */}
      <div className="mb-8 rounded-xl border bg-card p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-xl">Assigned Outages</CardTitle>
          <Link href="/technician/outages">
            <Button>View All Assigned</Button>
          </Link>
        </div>

        <div className="space-y-3">
          {outagesLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))
          ) : outages?.data && outages.data.length > 0 ? (
            outages.data.slice(0, 5).map((outage) => (
              <div
                key={outage.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-4">
                  <Badge variant={outageVariant(outage.status)}>
                    {outage.status}
                  </Badge>
                  <div>
                    <p className="font-medium">
                      Outage #{outage.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {outage.area?.name || "Unknown Area"} •{" "}
                      {new Date(outage.reportedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {outage.isPriority && (
                    <Badge variant="warning" className="gap-1">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                      Priority
                    </Badge>
                  )}
                  <Link
                    href={`/technician/outage?id=${outage.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {outage.status === "ASSIGNED" ? "Start Work" : "Continue"}
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={<CheckCircle className="h-5 w-5 text-emerald" />}
              title="All tasks completed!"
              description="Great work! No outages assigned at this time."
            />
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Performance overview */}
        <div className="rounded-xl border bg-card p-6">
          <CardTitle className="mb-4 text-xl">Performance Overview</CardTitle>
          <div className="space-y-4">
            <div>
              <TelemetryRow label="First-Time Fix Rate" value={`${fixRate}%`} />
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald transition-all"
                  style={{ width: `${fixRate}%` }}
                />
              </div>
            </div>
            <div>
              <TelemetryRow
                label="Avg Resolution Time"
                value={`${avgResolution}h`}
              />
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-electric-blue transition-all"
                  style={{
                    width: `${Math.min((avgResolution / 24) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border bg-card p-6">
          <CardTitle className="mb-4 text-xl">Quick Actions</CardTitle>
          <div className="space-y-3">
            <Link href="/technician/outages">
              <Button className="w-full justify-start gap-3">
                <AlertTriangle className="h-5 w-5" />
                View All Assigned Outages
              </Button>
            </Link>
            <Link href="/technician/summary">
              <Button variant="outline" className="w-full justify-start gap-3">
                <BarChart3 className="h-5 w-5" />
                View Performance Summary
              </Button>
            </Link>
            <Link href="/technician/profile">
              <Button variant="outline" className="w-full justify-start gap-3">
                <User className="h-5 w-5" />
                Update Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
