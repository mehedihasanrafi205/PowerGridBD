"use client";

import { useAuth } from "@/hooks";
import {
  useOperationalAnalytics,
  usePerformanceAnalytics,
  useGeographicalAnalytics,
  useTrendsAnalytics,
} from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Users,
  Clock,
  TrendingUp,
  BarChart3,
  MapPin,
  Loader2,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OperatorAnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: analytics, isLoading: analyticsLoading } =
    useOperationalAnalytics();
  const { data: performance, isLoading: performanceLoading } =
    usePerformanceAnalytics();
  const { data: geographical, isLoading: geographicalLoading } =
    useGeographicalAnalytics();
  const { data: trends, isLoading: trendsLoading } = useTrendsAnalytics();

  if (
    authLoading ||
    analyticsLoading ||
    performanceLoading ||
    geographicalLoading ||
    trendsLoading
  ) {
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
        <p className="text-muted-foreground mt-1">
          Real-time performance metrics and grid insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Outages</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {a?.activeOutages || 0}
                </p>
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
                <p className="text-sm text-muted-foreground">
                  Priority Outages
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {a?.priorityOutages || 0}
                </p>
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
                <p className="text-sm text-muted-foreground">
                  Active Schedules
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {a?.activeSchedules || 0}
                </p>
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
                <span className="text-muted-foreground">
                  MTTR (Mean Time To Resolution)
                </span>
                <span className="font-semibold text-blue-600">
                  {p?.mttr || 0}h
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(((p?.mttr || 0) / 48) * 100, 100)}%`,
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
                  Avg Assignment Time
                </span>
                <span className="font-semibold text-green-600">
                  {p?.avgAssignmentTime || 0}h
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(((p?.avgAssignmentTime || 0) / 24) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Target: {"<"} 4h
              </p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  First-Time Fix Rate
                </span>
                <span className="font-semibold text-purple-600">
                  {p?.firstTimeFixRate || 0}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${p?.firstTimeFixRate || 0}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Target: {">"} 90%
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
            {p?.technicianWorkload && p.technicianWorkload.length > 0 ? (
              <div className="space-y-4">
                {p.technicianWorkload.map((tech: any) => (
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
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p>No workload data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Geographical Analytics */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Outages by Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            {g?.outageByArea && g.outageByArea.length > 0 ? (
              <div className="space-y-3">
                {g.outageByArea.slice(0, 10).map((area: any) => (
                  <div
                    key={area.areaId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium">
                        {area.areaName}
                      </span>
                    </div>
                    <Badge variant="secondary">{area.outageCount}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p>No geographical data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top Problem Feeders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {g?.topWorstFeeders && g.topWorstFeeders.length > 0 ? (
              <div className="space-y-3">
                {g.topWorstFeeders.slice(0, 10).map((feeder: any) => (
                  <div
                    key={feeder.feederId}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{feeder.feederName}</p>
                      <p className="text-xs text-muted-foreground">
                        {feeder.outageCount} outages
                      </p>
                    </div>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p>No critical feeders identified</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Daily Outage Trend (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-around gap-1 p-4">
              {t?.dailyOutages?.slice(-30).map((day: any, i) => (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                    style={{
                      height: `${Math.max(day.count / Math.max(...t.dailyOutages.map((d: any) => d.count), 1)) * 80}%`,
                    }}
                  />
                  <span className="text-xs text-muted-foreground mt-1">
                    {i % 5 === 0 ? day.date : ""}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Total:{" "}
              {t?.dailyOutages?.reduce(
                (sum: number, d: any) => sum + d.count,
                0,
              ) || 0}{" "}
              outages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Peak Load-Shedding Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {t?.peakLoadSheddingHours?.map((hour: any) => (
                <div
                  key={hour.hour}
                  className="flex items-center justify-between"
                >
                  <span className="font-medium">{hour.hour}:00</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex-1 h-4 bg-primary rounded max-w-xs"
                      style={{
                        width: `${Math.max(hour.count / Math.max(...t.peakLoadSheddingHours.map((h: any) => h.count), 1)) * 100}%`,
                      }}
                    />
                    <span className="text-sm text-muted-foreground w-10 text-right">
                      {hour.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
