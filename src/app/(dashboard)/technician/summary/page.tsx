"use client";

import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  TrendingUp,
  User,
  Users,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, useTechnicianSummary, useTechnicianWorkload } from "@/hooks";

interface WorkloadItem {
  technicianId: string;
  technicianName: string;
  assignedCount: number;
  resolvedCount: number;
  avgResolutionTime: number;
  firstTimeFixRate: number;
}

export default function TechnicianSummaryPage() {
  const { isLoading: authLoading } = useAuth();
  const { data: summary, isLoading: summaryLoading } = useTechnicianSummary();
  const { data: workload, isLoading: workloadLoading } =
    useTechnicianWorkload();

  if (authLoading || summaryLoading || workloadLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border bg-card p-6">
                <div className="mb-2 h-4 w-1/4 rounded bg-muted" />
                <div className="h-8 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
          <div className="mt-8 h-64 rounded bg-muted" />
        </div>
      </div>
    );
  }

  const s = summary?.data;
  const technicianWorkload: WorkloadItem[] =
    workload?.data?.technicianWorkload ?? [];
  const completionRate = Math.round(
    ((s?.resolvedCount || 0) / Math.max(s?.assignedCount || 1, 1)) * 100,
  );

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <PageHeader
        title="Performance Summary"
        description="Your performance metrics and workload overview."
      />

      {/* Key stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OperationalMetric
          label="Assigned Tasks"
          value={s?.assignedCount || 0}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <OperationalMetric
          label="In Progress"
          value={s?.ongoingCount || 0}
          icon={<Clock className="h-5 w-5" />}
        />
        <OperationalMetric
          label="Resolved This Month"
          value={s?.resolvedCount || 0}
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <OperationalMetric
          label="Avg Resolution Time"
          value={`${s?.avgResolutionTime || 0}h`}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Performance charts */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <TelemetryRow
                label="First-Time Fix Rate"
                value={`${s?.firstTimeFixRate || 0}%`}
              />
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald transition-all"
                  style={{ width: `${s?.firstTimeFixRate || 0}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Target: &gt; 90%
              </p>
            </div>

            <div>
              <TelemetryRow
                label="Avg Resolution Time"
                value={`${s?.avgResolutionTime || 0}h`}
              />
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-electric-blue transition-all"
                  style={{
                    width: `${Math.min(((s?.avgResolutionTime || 0) / 48) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Target: &lt; 24h
              </p>
            </div>

            <div>
              <TelemetryRow
                label="Tasks Completed On Time"
                value={`${completionRate}%`}
              />
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Completion rate
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Technician Workload
            </CardTitle>
          </CardHeader>
          <CardContent>
            {technicianWorkload.length > 0 ? (
              <div className="space-y-4">
                {technicianWorkload.map((tech) => (
                  <div key={tech.technicianId} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{tech.technicianName}</span>
                      <span className="font-mono tabular-nums text-muted-foreground">
                        {tech.assignedCount} assigned / {tech.resolvedCount}{" "}
                        resolved
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${Math.min((tech.assignedCount / 10) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="font-mono text-xs tabular-nums text-muted-foreground">
                      Avg resolution: {tech.avgResolutionTime}h | Fix rate:{" "}
                      {tech.firstTimeFixRate.toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<BarChart3 className="h-5 w-5" />}
                title="No workload data available"
                description="Workload distribution will appear here."
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Workload details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Workload Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {technicianWorkload.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-2 pr-4">Technician</th>
                    <th className="pb-2 pr-4 text-right">Assigned</th>
                    <th className="pb-2 pr-4 text-right">Resolved</th>
                    <th className="pb-2 pr-4 text-right">Avg Time</th>
                    <th className="pb-2 text-right">Fix Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {technicianWorkload.map((tech) => (
                    <tr
                      key={tech.technicianId}
                      className="border-b transition-colors last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-3 font-medium">
                        {tech.technicianName}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono tabular-nums">
                        {tech.assignedCount}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono tabular-nums text-emerald">
                        {tech.resolvedCount}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono tabular-nums">
                        {tech.avgResolutionTime}h
                      </td>
                      <td className="py-3 text-right font-semibold">
                        <Badge
                          variant={
                            tech.firstTimeFixRate >= 90 ? "success" : "warning"
                          }
                        >
                          {tech.firstTimeFixRate.toFixed(1)}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={<BarChart3 className="h-5 w-5" />}
              title="No workload data available"
              description="Detailed breakdown will appear here."
            />
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/technician/outages">
          <Button variant="outline" className="h-14 w-full justify-start gap-3">
            <AlertTriangle className="h-5 w-5" />
            View All Assigned
          </Button>
        </Link>
        <Link href="/technician/profile">
          <Button variant="outline" className="h-14 w-full justify-start gap-3">
            <User className="h-5 w-5" />
            Update Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
