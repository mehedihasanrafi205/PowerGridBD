"use client";

import { useAuth } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, AlertTriangle, Clock, CheckCircle, BarChart3, TrendingUp, User } from "lucide-react";
import { useTechnicianSummary } from "@/hooks";
import { useOutages } from "@/hooks";
import { cn } from "@/lib/utils";

export default function TechnicianDashboard() {
  const { user, isLoading } = useAuth();
  const { data: summary, isLoading: summaryLoading } = useTechnicianSummary();
  const { data: outages, isLoading: outagesLoading } = useOutages({ 
    status: ["ASSIGNED", "IN_PROGRESS"], 
    limit: 5 
  });

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
      title: "Assigned Tasks",
      value: summary?.data?.assignedCount || 0,
      icon: AlertTriangle,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      title: "In Progress",
      value: summary?.data?.ongoingCount || 0,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-100",
    },
    {
      title: "Resolved This Month",
      value: summary?.data?.resolvedCount || 0,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-100",
    },
    {
      title: "Avg Resolution Time",
      value: `${summary?.data?.avgResolutionTime || 0}h`,
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name?.split(" ")[0]}!</h1>
        <p className="text-muted-foreground mt-1">Here's your task overview and performance summary.</p>
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
                <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={cn(stat.bg, "p-3 rounded-xl")}>
                <stat.icon className={cn(stat.color, "h-6 w-6")} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-xl p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <CardTitle className="text-xl">Assigned Outages</CardTitle>
          <Link href="/technician/outages">
            <Button>
              View All Assigned
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {outages && outages.data && outages.data.length > 0 ? (
            outages.data.slice(0, 5).map((outage) => (
              <div
                key={outage.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      outage.status === "ASSIGNED"
                        ? "info"
                        : outage.status === "IN_PROGRESS"
                        ? "default"
                        : "success"
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
                  <Link href={`/technician/outage/${outage.id}`} className="text-sm text-primary hover:underline">
                    {outage.status === "ASSIGNED" ? "Start Work" : "Continue"}
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
              <p className="text-lg">All tasks completed!</p>
              <p>Great work! No outages assigned at this time.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-card border rounded-xl p-6">
          <CardTitle className="text-xl mb-4">Performance Overview</CardTitle>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">First-Time Fix Rate</span>
                <span className="font-semibold">{summary?.data?.firstTimeFixRate || 0}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${summary?.data?.firstTimeFixRate || 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Avg Resolution Time</span>
                <span className="font-semibold">{summary?.data?.avgResolutionTime || 0}h</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.min((summary?.data?.avgResolutionTime || 0) / 24 * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <CardTitle className="text-xl mb-4">Quick Actions</CardTitle>
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
