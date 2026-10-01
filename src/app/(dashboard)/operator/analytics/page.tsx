"use client";

import { useAuth } from "@/hooks";
import { useOperationalAnalytics, usePerformanceAnalytics, useGeographicalAnalytics, useTrendsAnalytics } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Users, Clock, TrendingUp, BarChart3, MapPin, Loader2, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OperatorAnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: analytics, isLoading: analyticsLoading } = useOperationalAnalytics();
  const { data: performance, isLoading: performanceLoading } = usePerformanceAnalytics();
  const { data: geographical, isLoading: geographicalLoading } = useGeographicalAnalytics();
  const { data: trends, isLoading: trendsLoading } = useTrendsAnalytics();

  if (authLoading || analyticsLoading || performanceLoading || geographicalLoading || trendsLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
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

  const a = analytics?.data;
  const p = performance?.data;
  const g = geographical?.data;
  const t = trends?.data;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Operational Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Real-time performance metrics and grid insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Outages</p>
                <p className="text-3xl font-bold text-foreground mt-1">{a?.activeOutages || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Priority Outages</p>
                <p className="text-3xl font-bold text-foreground mt-1">{a?.priorityOutages || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100">
                <Target className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Techs</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {a?.availableTechnicians || 0} / {a?.totalTechnicians || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Schedules</p>
                <p className="text-3xl font-bold text-foreground mt-1">{a?.activeSchedules || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">MTTR (Mean Time To Resolution)</span>
                <span className="font-semibold text-blue-600">{p?.mttr || 0}h</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.min((p?.mttr || 0) / 48 * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Target: {"<"} 24h</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Avg Assignment Time</span>
                <span className="font-semibold text-green-600">{p?.avgAssignmentTime || 0}h</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${Math.min((p?.avgAssignmentTime || 0) / 24 * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Target: {"<"} 4h</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">First-Time Fix Rate</span>
                <span className="font-semibold text-purple-600">{p?.firstTimeFixRate || 0}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${p?.firstTimeFixRate || 0}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Target: {">"} 90%</p>
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
            {p?.technicianWorkload && p.technicianWorkload.length > 0 ? (
              <div className="space-y-4">
                {p.technicianWorkload.map((tech: any) => (
                  <div key={tech.technicianId} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{tech.technicianName}</span>
                      <span className="text-muted-foreground">
                        {tech.assignedCount} assigned / {tech.resolvedCount} resolved
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
