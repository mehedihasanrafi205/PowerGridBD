"use client";

import { useAuth } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  CreditCard,
  BarChart3,
  FileText,
  GitBranch,
  AlertCircle,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useOperationalAnalytics } from "@/hooks";
import { useFinancialAnalytics } from "@/hooks";
import { useOutages } from "@/hooks";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const { data: analytics, isLoading: analyticsLoading } =
    useOperationalAnalytics();
  const { data: financial, isLoading: financialLoading } =
    useFinancialAnalytics();
  const { data: outages, isLoading: outagesLoading } = useOutages({ limit: 5 });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-card border rounded-xl p-6 animate-pulse"
            >
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
      title: "Total Users",
      value: analytics?.data?.totalUsers || 0,
      icon: Users,
      color: "text-electric-blue",
      bg: "bg-electric-blue/15",
    },
    {
      title: "Active Outages",
      value: analytics?.data?.activeOutages || 0,
      icon: AlertCircle,
      color: "text-destructive",
      bg: "bg-destructive/15",
    },
    {
      title: "Total Revenue",
      value: `BDT ${financial?.data?.totalRevenue || 0}`,
      icon: CreditCard,
      color: "text-emerald",
      bg: "bg-emerald/15",
    },
    {
      title: "SLA Subscriptions",
      value: financial?.data?.activeSlaSubscriptions || 0,
      icon: Shield,
      color: "text-primary",
      bg: "bg-primary/15",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Console</h1>
        <p className="text-muted-foreground mt-1">
          Executive overview of platform metrics and system health.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={cn(stat.bg, "p-3 rounded-xl")}>
                <stat.icon className={cn(stat.color, "h-6 w-6")} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl">Quick Links</CardTitle>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/users">
              <Button
                variant="outline"
                className="h-20 justify-start gap-3 p-4"
              >
                <Users className="h-6 w-6" />
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
                className="h-20 justify-start gap-3 p-4"
              >
                <Shield className="h-6 w-6" />
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
                className="h-20 justify-start gap-3 p-4"
              >
                <CreditCard className="h-6 w-6" />
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
                className="h-20 justify-start gap-3 p-4"
              >
                <FileText className="h-6 w-6" />
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

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl">Financial Overview</CardTitle>
          </div>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-emerald">
                  BDT {financial?.data?.totalRevenue || 0}
                </p>
              </div>
              <div className="p-4 bg-electric-blue/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-electric-blue">
                  {financial?.data?.successRate || 0}%
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Active SLA Subscriptions
                </p>
                <p className="text-2xl font-bold text-primary">
                  {financial?.data?.activeSlaSubscriptions || 0}
                </p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Priority Revenue
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  BDT {financial?.data?.revenueByType?.priorityRestoration || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl">Recent Outages</CardTitle>
            <Link
              href="/admin/outages"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {outages && outages.data && outages.data.length > 0 ? (
              outages.data.slice(0, 5).map((outage) => (
                <div
                  key={outage.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-destructive/15 text-destructive font-medium">
                      {outage.status}
                    </span>
                    <div>
                      <p className="font-medium text-sm">
                        Outage #{outage.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {outage.area?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/admin/outages/${outage.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No recent outages
              </p>
            )}
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <CardTitle className="text-xl mb-4">Role Distribution</CardTitle>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 bg-electric-blue/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-electric-blue">0</p>
              <p className="text-sm text-muted-foreground">Customers</p>
            </div>
            <div className="p-4 bg-emerald/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-emerald">0</p>
              <p className="text-sm text-muted-foreground">Technicians</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-amber-600">0</p>
              <p className="text-sm text-muted-foreground">Operators</p>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-destructive">0</p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-6">
        <CardTitle className="text-xl mb-4">System Health</CardTitle>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-4 bg-emerald/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Grid Uptime</p>
            <p className="text-2xl font-bold text-emerald">99.9%</p>
          </div>
          <div className="p-4 bg-electric-blue/10 rounded-lg">
            <p className="text-sm text-muted-foreground">API Response</p>
            <p className="text-2xl font-bold text-electric-blue">{"<"} 200ms</p>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Error Rate</p>
            <p className="text-2xl font-bold text-primary">{"<"} 0.1%</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Active Alerts</p>
            <p className="text-2xl font-bold text-amber-600">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
