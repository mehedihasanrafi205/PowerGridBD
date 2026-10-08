"use client";

import { useAuth } from "@/hooks";
import { useTechnicianSummary, useTechnicianWorkload } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Loader2,
  User,
  Calendar,
  Users,
  Link as LinkIcon,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function TechnicianSummaryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: summary, isLoading: summaryLoading } = useTechnicianSummary();
  const { data: workload, isLoading: workloadLoading } =
    useTechnicianWorkload();

  if (authLoading || summaryLoading || workloadLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
          <div className="h-8 w-1/4 bg-muted rounded" />
          <div className="grid md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border rounded-xl p-6">
                <div className="h-4 w-1/4 bg-muted rounded mb-2" />
                <div className="h-8 w-1/2 bg-muted rounded" />
              </div>
            ))}
          </div>
          <div className="mt-8 h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const s = summary?.data;
  const w = workload?.data;
  const technicianWorkload = w?.technicianWorkload ?? [];

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Performance Summary
        </h1>
        <p className="text-muted-foreground mt-1">
          Your performance metrics and workload overview
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assigned Tasks</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {s?.assignedCount || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-electric-blue/15">
                <AlertTriangle className="h-6 w-6 text-electric-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {s?.ongoingCount || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber/15">
                <Clock className="h-6 w-6 text-amber" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Resolved This Month
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {s?.resolvedCount || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald/15">
                <CheckCircle className="h-6 w-6 text-emerald" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg Resolution Time
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {s?.avgResolutionTime || 0}h
                </p>
              </div>
              <div className="p-3 rounded-xl bg-primary/15">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  First-Time Fix Rate
                </span>
                <span className="font-semibold text-emerald">
                  {s?.firstTimeFixRate || 0}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald rounded-full transition-all"
                  style={{ width: `${s?.firstTimeFixRate || 0}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Target: {">"} 90%
              </p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  Avg Resolution Time
                </span>
                <span className="font-semibold text-electric-blue">
                  {s?.avgResolutionTime || 0}h
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-electric-blue rounded-full transition-all"
                  style={{
                    width: `${Math.min(((s?.avgResolutionTime || 0) / 48) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Target: {"<"} 24h
              </p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  Tasks Completed On Time
                </span>
                <span className="font-semibold text-primary">
                  {Math.round(
                    ((s?.resolvedCount || 0) /
                      Math.max(s?.assignedCount || 1, 1)) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${Math.round(((s?.resolvedCount || 0) / Math.max(s?.assignedCount || 1, 1)) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
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
                {technicianWorkload.map((tech: any) => (
                  <div key={tech.technicianId} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{tech.technicianName}</span>
                      <span className="text-muted-foreground">
                        {tech.assignedCount} assigned / {tech.resolvedCount}{" "}
                        resolved
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${Math.min((tech.assignedCount / 10) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Avg resolution: {tech.avgResolutionTime}h | Fix rate:{" "}
                      {tech.firstTimeFixRate.toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p>No workload data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Workload Details */}
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
                  {technicianWorkload.map((tech: any) => (
                    <tr
                      key={tech.technicianId}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-3 font-medium">
                        {tech.technicianName}
                      </td>
                      <td className="py-3 pr-4 text-right">
                        {tech.assignedCount}
                      </td>
                      <td className="py-3 pr-4 text-right text-emerald">
                        {tech.resolvedCount}
                      </td>
                      <td className="py-3 pr-4 text-right">
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
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p>No workload data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <Link href="/technician/outages">
          <Button variant="outline" className="w-full justify-start gap-3 h-14">
            <AlertTriangle className="h-5 w-5" />
            View All Assigned
          </Button>
        </Link>
        <Link href="/technician/profile">
          <Button variant="outline" className="w-full justify-start gap-3 h-14">
            <User className="h-5 w-5" />
            Update Profile
          </Button>
        </Link>
        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-14"
          disabled
        >
          <Download className="h-5 w-5" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
