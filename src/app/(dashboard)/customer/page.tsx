"use client";

import { AlertTriangle, CreditCard, PlusCircle, Shield } from "lucide-react";
import Link from "next/link";
import {
  GridStatusIndicator,
  OperationalMetric,
  PageHeader,
} from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { useAuth, useMySummary, useOutages } from "@/hooks";
import { outageBadgeVariant } from "@/lib/status-variants";
import { cn } from "@/lib/utils";

/** Map outage status to a semantic Badge variant. */

export default function CustomerDashboard() {
  const { user, isLoading } = useAuth();
  const { data: summary, isLoading: summaryLoading } = useMySummary();
  const { data: outages, isLoading: outagesLoading } = useOutages({
    status: ["PENDING", "ASSIGNED", "IN_PROGRESS"],
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

  const slaActive = summary?.data?.slaActive ?? false;
  const byStatus = summary?.data?.reportsByStatus ?? {};
  const activeReports =
    (byStatus.PENDING || 0) +
    (byStatus.ASSIGNED || 0) +
    (byStatus.IN_PROGRESS || 0);

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0]}!`}
        description="Here's an overview of your power outage reports and account status."
        actions={
          <Link href="/customer/outage/report">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              Report New Outage
            </Button>
          </Link>
        }
        status={
          <GridStatusIndicator
            status={activeReports > 0 ? "warning" : "operational"}
            label={
              activeReports > 0
                ? `${activeReports} active report${activeReports === 1 ? "" : "s"}`
                : "No active outages"
            }
          />
        }
      />

      {/* KPI metrics */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OperationalMetric
          label="Active Outages"
          value={summary?.data?.reportsByStatus?.PENDING || 0}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <OperationalMetric
          label="Priority Restorations"
          value={summary?.data?.priorityCount || 0}
          icon={<Shield className="h-5 w-5" />}
          delta="Active"
        />
        <OperationalMetric
          label="SLA Status"
          value={slaActive ? "Active" : "Inactive"}
          icon={<Shield className="h-5 w-5" />}
          delta={slaActive ? "Expires in 15 days" : "Subscribe now"}
        />
        <OperationalMetric
          label="Total Paid"
          value={`BDT ${summary?.data?.totalPaid || 0}`}
          icon={<CreditCard className="h-5 w-5" />}
          delta="This month"
        />
      </div>

      {/* Quick actions */}
      <div className="mb-8 rounded-xl border bg-card p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <div className="flex gap-3">
            <Link href="/customer/outage/report">
              <Button size="lg">
                <PlusCircle className="mr-2 h-5 w-5" />
                Report New Outage
              </Button>
            </Link>
            <Link href="/customer/sla">
              <Button variant="outline" size="lg">
                <Shield className="mr-2 h-5 w-5" />
                Manage SLA
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent outages */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b p-4">
          <CardTitle className="text-xl">Recent Outage Reports</CardTitle>
          <Link
            href="/customer/outages"
            className="text-sm text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="p-4">
          {outagesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : outages?.data && outages.data.length > 0 ? (
            <div className="space-y-3">
              {outages.data.slice(0, 5).map((outage) => (
                <div
                  key={outage.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant={outageBadgeVariant(outage.status)}>
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
                      href={`/customer/outage?id=${outage.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>No outage reports yet.</p>
              <Link
                href="/customer/outage/report"
                className="ml-2 text-primary hover:underline"
              >
                Report your first outage
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* SLA subscription status — theme-adaptive cards */}
      <div className="mt-8 rounded-xl border bg-card p-6">
        <CardTitle className="mb-4 text-xl">SLA Subscription Status</CardTitle>
        <div className="grid gap-6 md:grid-cols-3">
          {/* SLA state */}
          <div
            className={cn(
              "rounded-lg border p-4",
              slaActive
                ? "border-emerald/30 bg-emerald/10"
                : "border-border bg-muted",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "rounded-lg p-3",
                  slaActive ? "bg-emerald/15" : "bg-muted",
                )}
              >
                <Shield
                  className={cn(
                    "h-6 w-6",
                    slaActive ? "text-emerald" : "text-muted-foreground",
                  )}
                />
              </div>
              <div>
                <p className="font-semibold">
                  {slaActive ? "SLA Active" : "SLA Inactive"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {slaActive
                    ? `Expires: ${summary?.data?.slaExpiryDate ? new Date(summary.data.slaExpiryDate).toLocaleDateString() : "Unknown"}`
                    : "No active SLA subscription"}
                </p>
              </div>
            </div>
          </div>

          {/* Priority restoration */}
          <div className="rounded-lg border border-electric-blue/30 bg-electric-blue/10 p-4">
            <p className="mb-2 font-semibold text-electric-blue">
              Priority Restoration
            </p>
            <p className="text-sm text-electric-blue/80">
              {summary?.data && summary.data.priorityCount > 0
                ? `${summary.data.priorityCount} outage(s) with priority status`
                : "No priority restorations active"}
            </p>
          </div>

          {/* Total investment */}
          <div className="rounded-lg border border-smart-teal/30 bg-smart-teal/10 p-4">
            <p className="mb-2 font-semibold text-smart-teal">
              Total Investment
            </p>
            <p className="text-2xl font-bold text-smart-teal">
              BDT {summary?.data?.totalPaid || 0}
            </p>
          </div>
        </div>
        {!slaActive && (
          <div className="mt-4 text-center">
            <Link href="/customer/sla">
              <Button size="lg">
                <Shield className="mr-2 h-5 w-5" />
                Subscribe to SLA
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
