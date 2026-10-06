"use client";

import {
  AlertTriangle,
  BarChart3,
  Clock,
  Loader2,
  MapPin,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { SimpleHorizontalBarChart, SimpleLineChart } from "@/components/charts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAuth,
  useGeographicalAnalytics,
  useOperationalAnalytics,
  usePerformanceAnalytics,
  useTrendsAnalytics,
} from "@/hooks";
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

  // Prepare chart data
  const dailyOutageData =
    t?.dailyOutages?.slice(-30).map((day: any) => ({
      date: day.date,
      count: day.count,
    })) || [];

  const peakHoursData =
    t?.peakLoadSheddingHours?.map((hour: any) => ({
      name: `${hour.hour}:00`,
      value: hour.count,
    })) || [];

  const outageByAreaData =
    g?.outageByArea?.slice(0, 10).map((area: any) => ({
      name: area.areaName,
      value: area.outageCount,
    })) || [];

  const topFeedersData =
    g?.topWorstFeeders?.slice(0, 10).map((feeder: any) => ({
      name: feeder.feederName,
      value: feeder.outageCount,
    })) || [];

  const technicianWorkloadData =
    p?.technicianWorkload?.map((tech: any) => ({
      name: tech.technicianName,
      assigned: tech.assignedCount,
      resolved: tech.resolvedCount,
    })) || [];

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
                Target: &lt; 24h
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
                Target: &lt; 4h
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
                Target: &gt; 90%
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
            {technicianWorkloadData.length > 0 ? (
              <SimpleHorizontalBarChart
                data={technicianWorkloadData.map((t) => ({
                  name: t.name,
                  value: t.assigned,
                }))}
                dataKey="value"
                nameKey="name"
                height={Math.max(technicianWorkloadData.length * 35, 200)}
                color="hsl(var(--primary))"
              />
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
            {outageByAreaData.length > 0 ? (
              <SimpleHorizontalBarChart
                data={outageByAreaData}
                dataKey="value"
                nameKey="name"
                height={Math.max(outageByAreaData.length * 35, 200)}
                color="hsl(var(--primary))"
              />
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
            {topFeedersData.length > 0 ? (
              <SimpleHorizontalBarChart
                data={topFeedersData}
                dataKey="value"
                nameKey="name"
                height={Math.max(topFeedersData.length * 35, 200)}
                color="hsl(var(--destructive))"
              />
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
            {dailyOutageData.length > 0 ? (
              <>
                <SimpleLineChart
                  data={dailyOutageData}
                  dataKey="count"
                  nameKey="date"
                  height={250}
                  color="hsl(var(--primary))"
                  showArea={true}
                />
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Total:{" "}
                  {t?.dailyOutages?.reduce(
                    (sum: number, d: any) => sum + d.count,
                    0,
                  ) || 0}{" "}
                  outages
                </p>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p>No trend data available</p>
              </div>
            )}
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
            {peakHoursData.length > 0 ? (
              <SimpleHorizontalBarChart
                data={peakHoursData}
                dataKey="value"
                nameKey="name"
                height={Math.max(peakHoursData.length * 35, 300)}
                color="hsl(var(--secondary))"
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p>No load-shedding data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
