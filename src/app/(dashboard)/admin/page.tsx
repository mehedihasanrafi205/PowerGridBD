"use client";

import { AlertCircle, CreditCard, FileText, Shield, Users } from "lucide-react";
import Link from "next/link";
import {
  EmptyState,
  GridStatusIndicator,
  OperationalMetric,
  PageHeader,
  TelemetryRow,
} from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  useAuth,
  useFinancialAnalytics,
  useOperationalAnalytics,
  useOutages,
  useUsers,
} from "@/hooks";
import { asCount } from "@/lib/analytics";
import { outageBadgeVariant } from "@/lib/status-variants";

/** Map outage status to a semantic Badge variant. */

export default function AdminDashboard() {
  const { isLoading } = useAuth();
  const { data: analytics, isLoading: analyticsLoading } =
    useOperationalAnalytics();
  const { data: financial } = useFinancialAnalytics();
  const { data: outages } = useOutages({ limit: 5 });

  // Real per-role user counts: one lightweight query per role
  // (limit 1 — only the meta.total is read).
  const { data: customers } = useUsers({ role: "CUSTOMER", limit: 1 });
  const { data: technicians } = useUsers({ role: "TECHNICIAN", limit: 1 });
  const { data: operators } = useUsers({ role: "POWER_OPERATOR", limit: 1 });
  const { data: admins } = useUsers({ role: "ADMIN", limit: 1 });

  const roleCounts = [
    {
      label: "Customers",
      value: customers?.meta?.total,
      tint: "bg-electric-blue/10",
      text: "text-electric-blue",
    },
    {
      label: "Technicians",
      value: technicians?.meta?.total,
      tint: "bg-emerald/10",
      text: "text-emerald",
    },
    {
      label: "Operators",
      value: operators?.meta?.total,
      tint: "bg-amber/10",
      text: "text-amber",
    },
    {
      label: "Admins",
      value: admins?.meta?.total,
      tint: "bg-destructive/10",
      text: "text-destructive",
    },
  ];

  const activeOutages = analytics?.data?.activeOutages ?? 0;
  const criticalFeedersDown = asCount(analytics?.data?.criticalFeedersDown);

  // Honest platform-health state derived from real telemetry.
  const platformStatus =
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
      <PageHeader
        title="Admin Console"
        description="Executive overview of platform metrics and system health."
        status={
          <GridStatusIndicator
            status={platformStatus}
            label={
              platformStatus === "critical"
                ? "Critical feeders down"
                : platformStatus === "warning"
                  ? "Active outages"
                  : "Platform operational"
            }
          />
        }
      />

      {/* KPI metrics */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OperationalMetric
          label="Total Users"
          value={analytics?.data?.totalUsers || 0}
          icon={<Users className="h-5 w-5" />}
        />
        <OperationalMetric
          label="Active Outages"
          value={activeOutages}
          icon={<AlertCircle className="h-5 w-5" />}
        />
        <OperationalMetric
          label="Total Revenue"
          value={`BDT ${financial?.data?.totalRevenue || 0}`}
          icon={<CreditCard className="h-5 w-5" />}
        />
        <OperationalMetric
          label="SLA Subscriptions"
          value={financial?.data?.activeSlaSubscriptions || 0}
          icon={<Shield className="h-5 w-5" />}
        />
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {/* Quick links */}
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle className="text-xl">Quick Links</CardTitle>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/admin/users">
              <Button
                variant="outline"
                className="h-20 w-full justify-start gap-3 p-4"
              >
                <Users className="h-6 w-6 shrink-0" />
                <div className="text-left">
                  <p className="font-medium">User Management</p>
                  <p className="text-sm text-muted-foreground">
                    Manage users & roles
                  </p>
                </div>
              </Button>
            </Link>
            <Link href="/admin/applications">
              <Button
                variant="outline"
                className="h-20 w-full justify-start gap-3 p-4"
              >
                <Shield className="h-6 w-6 shrink-0" />
                <div className="text-left">
                  <p className="font-medium">Applications</p>
                  <p className="text-sm text-muted-foreground">
                    Review tech applications
                  </p>
                </div>
              </Button>
            </Link>
            <Link href="/admin/payments">
              <Button
                variant="outline"
                className="h-20 w-full justify-start gap-3 p-4"
              >
                <CreditCard className="h-6 w-6 shrink-0" />
                <div className="text-left">
                  <p className="font-medium">Payments</p>
                  <p className="text-sm text-muted-foreground">
                    View & manage payments
                  </p>
                </div>
              </Button>
            </Link>
            <Link href="/admin/audit-logs">
              <Button
                variant="outline"
                className="h-20 w-full justify-start gap-3 p-4"
              >
                <FileText className="h-6 w-6 shrink-0" />
                <div className="text-left">
                  <p className="font-medium">Audit Logs</p>
                  <p className="text-sm text-muted-foreground">
                    System activity trail
                  </p>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Financial overview */}
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle className="text-xl">Financial Overview</CardTitle>
          </div>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-emerald/10 p-4">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-emerald">
                  BDT {financial?.data?.totalRevenue || 0}
                </p>
              </div>
              <div className="rounded-lg bg-electric-blue/10 p-4">
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-electric-blue">
                  {financial?.data?.successRate || 0}%
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-primary/10 p-4">
                <p className="text-sm text-muted-foreground">
                  Active SLA Subscriptions
                </p>
                <p className="font-mono text-2xl font-bold tabular-nums text-primary">
                  {financial?.data?.activeSlaSubscriptions || 0}
                </p>
              </div>
              <div className="rounded-lg bg-amber/10 p-4">
                <p className="text-sm text-muted-foreground">
                  Priority Revenue
                </p>
                <p className="font-mono text-2xl font-bold tabular-nums text-amber">
                  BDT {financial?.data?.revenueByType?.priorityRestoration || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {/* Recent outages */}
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle className="text-xl">Recent Outages</CardTitle>
            <Link
              href="/admin/outages"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {outages?.data && outages.data.length > 0 ? (
              outages.data.slice(0, 5).map((outage) => (
                <div
                  key={outage.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
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
                    href={`/admin/outage?id=${outage.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))
            ) : (
              <EmptyState
                title="No recent outages"
                description="Outage reports will appear here."
              />
            )}
          </div>
        </div>

        {/* Role distribution — real counts from the users API */}
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle className="text-xl">Role Distribution</CardTitle>
            <Link
              href="/admin/users"
              className="text-sm text-primary hover:underline"
            >
              Manage
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {roleCounts.map((role) => (
              <div
                key={role.label}
                className={`rounded-lg p-4 text-center ${role.tint}`}
              >
                {role.value === undefined ? (
                  <div className="mx-auto h-8 w-12 animate-pulse rounded bg-muted" />
                ) : (
                  <p
                    className={`font-mono text-3xl font-bold tabular-nums ${role.text}`}
                  >
                    {role.value}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">{role.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational telemetry — real backend data, never invented */}
      <div className="rounded-xl border bg-card p-6">
        <CardTitle className="mb-4 text-xl">Operational Telemetry</CardTitle>
        <div className="grid gap-x-8 gap-y-1 md:grid-cols-2">
          <TelemetryRow label="Active Outages" value={activeOutages} />
          <TelemetryRow
            label="Priority Outages"
            value={analytics?.data?.priorityOutages ?? 0}
          />
          <TelemetryRow
            label="Available Technicians"
            value={`${asCount(analytics?.data?.availableTechnicians)} / ${analytics?.data?.totalTechnicians ?? 0}`}
          />
          <TelemetryRow
            label="Active Schedules"
            value={analytics?.data?.activeSchedules ?? 0}
          />
          <TelemetryRow
            label="Critical Feeders Down"
            value={criticalFeedersDown}
            status={criticalFeedersDown > 0 ? "critical" : "operational"}
          />
          <TelemetryRow
            label="MTTR"
            value={analytics?.data?.mttr ?? 0}
            unit="h"
          />
        </div>
      </div>
    </div>
  );
}
