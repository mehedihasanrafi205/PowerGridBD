"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, AlertTriangle, Users, Calendar, BarChart3, GitBranch, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { useOperationalAnalytics } from "@/hooks/analytics.hook";
import { useOutages } from "@/hooks/outage.hook";
import { useSchedules } from "@/hooks/schedule.hook";
import { cn } from "@/lib/utils";

export default function OperatorDashboard() {
  const { user, isLoading } = useAuth();
  const { data: analytics, isLoading: analyticsLoading } = useOperationalAnalytics();
  const { data: outages, isLoading: outagesLoading } = useOutages({ limit: 5 });
  const { data: schedules, isLoading: schedulesLoading } = useSchedules({ limit: 3 });

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
      value: analytics?.data?.activeOutages || 0,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-100",
    },
    {
      title: "Priority Outages",
      value: analytics?.data?.priorityOutages || 0,
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-100",
    },
    {
      title: "Available Technicians",
      value: `${analytics?.data?.availableTechnicians || 0} / ${analytics?.data?.totalTechnicians || 0}`,
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-100",
    },
    {
      title: "Active Schedules",
      value: analytics?.data?.activeSchedules || 0,
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Operator Dashboard</h1>
        <p className="text-muted-foreground mt-1">Operational overview of grid status, outages, and schedules.</p>
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
              <div className="p-3 rounded-xl bg-blue-100">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-xl p-6">
          <CardTitle className="text-xl mb-4">Quick Actions</CardTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/operator/outages">
              <Button className="w-full justify-start gap-3 h-14">
                <AlertTriangle className="h-5 w-5" />
                Manage Outages
              </Button>
            </Link>
            <Link href="/operator/schedules/create">
              <Button className="w-full justify-start gap-3 h-14">
                <PlusCircle className="h-5 w-5" />
                Create Schedule
              </Button>
            </Link>
            <Link href="/operator/grid">
              <Button variant="outline" className="w-full justify-start gap-3 h-14">
                <GitBranch className="h-5 w-5" />
                Manage Grid
              </Button>
            </Link>
            <Link href="/operator/applications">
              <Button variant="outline" className="w-full justify-start gap-3 h-14">
                <Users className="h-5 w-5" />
                Review Applications
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <CardTitle className="text-xl mb-4">Critical Feeders</CardTitle>
          <div className="space-y-3">
            {analytics?.data?.criticalFeeders?.length > 0 ? (
              analytics.data.criticalFeeders.slice(0, 5).map((feeder) => (
                <div key={feeder.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium">{feeder.name}</p>
                    <p className="text-sm text-muted-foreground">{feeder.zone?.name} Zone</p>
                  </div>
                  <Badge variant="destructive">{feeder.outageCount} outages</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No critical feeders at this time. All systems operational.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl">Recent Outages</CardTitle>
            <Link href="/operator/outages" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {outages?.data?.length > 0 ? (
              outages.data.slice(0, 5).map((outage) => (
                <div key={outage.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 font-medium">
                      {outage.status}
                    </span>
                    <div>
                      <p className="font-medium text-sm">Outage #{outage.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{outage.area?.name || "Unknown"}</p>
                    </div>
                  </div>
                  <Link href={`/operator/outages/${outage.id}`} className="text-sm text-primary hover:underline">Manage</Link>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No recent outages</p>
            )}
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl">Upcoming Schedules</CardTitle>
            <Link href="/operator/schedules" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {schedules?.data?.length > 0 ? (
              schedules.data.slice(0, 5).map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{schedule.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(schedule.startTime).toLocaleDateString()} - {new Date(schedule.endTime).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">{schedule.status}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No upcoming schedules</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-6">
        <CardTitle className="text-xl mb-4">Operational Analytics</CardTitle>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-muted-foreground">MTTR</p>
            <p className="text-2xl font-bold text-blue-600">{analytics?.data?.mttr || 0}h</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Avg Assignment</p>
            <p className="text-2xl font-bold text-green-600">{analytics?.data?.avgAssignmentTime || 0}h</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-muted-foreground">First-Time Fix</p>
            <p className="text-2xl font-bold text-purple-600">{analytics?.data?.firstTimeFixRate || 0}%</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Critical Feeders</p>
            <p className="text-2xl font-bold text-amber-600">{analytics?.data?.criticalFeeders?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}