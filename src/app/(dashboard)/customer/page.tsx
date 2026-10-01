"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, AlertTriangle, Shield, CreditCard, Clock, CheckCircle } from "lucide-react";
import { useMySummary } from "@/hooks/analytics.hook";
import { useOutages } from "@/hooks/outage.hook";
import { useMyPayments } from "@/hooks/payment.hook";
import { cn } from "@/lib/utils";

export default function CustomerDashboard() {
  const { user, isLoading } = useAuth();
  const { data: summary, isLoading: summaryLoading } = useMySummary();
  const { data: outages, isLoading: outagesLoading } = useOutages({ status: ["PENDING", "ASSIGNED", "IN_PROGRESS"], limit: 5 });
  const { data: payments, isLoading: paymentsLoading } = useMyPayments({ limit: 3 });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border rounded-xl p-6 animate-pulse">
              <div className="h-4 w-1/4 bg-muted rounded mb-2" />
              <div className="h-8 w-1/2 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Active Outages",
      value: summary?.data?.reportsByStatus?.PENDING || 0,
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-100",
      change: "+2 this week",
    },
    {
      title: "Priority Restorations",
      value: summary?.data?.priorityCount || 0,
      icon: Shield,
      color: "text-blue-500",
      bg: "bg-blue-100",
      change: "Active",
    },
    {
      title: "SLA Status",
      value: summary?.data?.slaActive ? "Active" : "Inactive",
      icon: Shield,
      color: summary?.data?.slaActive ? "text-green-500" : "text-gray-500",
      bg: summary?.data?.slaActive ? "bg-green-100" : "bg-gray-100",
      change: summary?.data?.slaActive ? "Expires in 15 days" : "Subscribe now",
    },
    {
      title: "Total Paid",
      value: `BDT ${summary?.data?.totalPaid || 0}`,
      icon: CreditCard,
      color: "text-green-500",
      bg: "bg-green-100",
      change: "This month",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name?.split(" ")[0]}!</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your power outage reports and account status.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.change}</p>
              </div>
              <div className={cn(stat.bg, "p-3 rounded-xl")}>
                <stat.icon className={cn(stat.color, "h-6 w-6")} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border rounded-xl p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <div className="flex gap-3">
            <Link href="/customer/outage/report">
              <Button size="lg">
                <PlusCircle className="h-5 w-5 mr-2" />
                Report New Outage
              </Button>
            </Link>
            <Link href="/customer/sla">
              <Button variant="outline" size="lg">
                <Shield className="h-5 w-5 mr-2" />
                Manage SLA
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Outages */}
      <div className="bg-card border rounded-xl">
        <div className="border-b p-4 flex items-center justify-between">
          <CardTitle className="text-xl">Recent Outage Reports</CardTitle>
          <Link href="/customer/outages" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="p-4">
          {outagesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : outages?.data && outages.data.length > 0 ? (
            <div className="space-y-3">
              {outages.data.slice(0, 5).map((outage) => (
                <div
                  key={outage.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        outage.status === "PENDING"
                          ? "warning"
                          : outage.status === "ASSIGNED"
                          ? "info"
                          : outage.status === "IN_PROGRESS"
                          ? "default"
                          : outage.status === "RESOLVED"
                          ? "success"
                          : "secondary"
                      }
                    >
                      {outage.status}
                    </Badge>
                    <div>
                      <p className="font-medium">Outage #{outage.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {outage.area?.name || "Unknown Area"} • {new Date(outage.reportedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {outage.isPriority && (
                      <Badge variant="warning" className="gap-1">
                        <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                        Priority
                      </Badge>
                    )}
                    <Link href={`/customer/outage/${outage.id}`} className="text-sm text-primary hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No outage reports yet.</p>
              <Link href="/customer/outage/report" className="text-primary hover:underline ml-2">
                Report your first outage
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* SLA Status */}
      <div className="bg-card border rounded-xl p-6 mt-8">
        <CardTitle className="text-xl mb-4">SLA Subscription Status</CardTitle>
        <div className="grid md:grid-cols-3 gap-6">
          <div className={cn("p-4 rounded-lg", summary?.data?.slaActive ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200")}>
            <div className="flex items-center gap-3">
              <div className={cn("p-3 rounded-lg", summary?.data?.slaActive ? "bg-green-100" : "bg-gray-100")}>
                <Shield className={cn("h-6 w-6", summary?.data?.slaActive ? "text-green-600" : "text-gray-400")} />
              </div>
              <div>
                <p className="font-semibold">{summary?.data?.slaActive ? "SLA Active" : "SLA Inactive"}</p>
                <p className="text-sm text-muted-foreground">
                  {summary?.data?.slaActive
                    ? `Expires: ${summary.data.slaExpiryDate ? new Date(summary.data.slaExpiryDate).toLocaleDateString() : "Unknown"}`
                    : "No active SLA subscription"}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-semibold text-blue-800 mb-2">Priority Restoration</p>
            <p className="text-sm text-blue-600">
              {summary?.data?.priorityCount > 0
                ? `${summary.data.priorityCount} outage(s) with priority status`
                : "No priority restorations active"}
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="font-semibold text-purple-800 mb-2">Total Investment</p>
            <p className="text-2xl font-bold text-purple-800">BDT {summary?.data?.totalPaid || 0}</p>
          </div>
        </div>
        {!summary?.data?.slaActive && (
          <div className="mt-4 text-center">
            <Link href="/customer/sla">
              <Button size="lg">
                <Shield className="h-5 w-5 mr-2" />
                Subscribe to SLA
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}