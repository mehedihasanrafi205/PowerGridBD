"use client";

import {
  AlertTriangle,
  BarChart3,
  Clock,
  MapPin,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  SimpleHorizontalBarChart,
  SimpleLineChart,
  useChartColors,
} from "@/components/charts";
import {
  EmptyState,
  OperationalMetric,
  PageHeader,
  TelemetryRow,
} from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAuth,
  useGeographicalAnalytics,
  useOperationalAnalytics,
  usePerformanceAnalytics,
  useTrendsAnalytics,
} from "@/hooks";
import { asCount } from "@/lib/analytics";

export default function OperatorAnalyticsPage() {
  const { isLoading: authLoading } = useAuth();
  const { data: analytics, isLoading: analyticsLoading } =
    useOperationalAnalytics();
  const { data: performance, isLoading: performanceLoading } =
    usePerformanceAnalytics();
  const { data: geographical, isLoading: geographicalLoading } =
    useGeographicalAnalytics();
  const { data: trends, isLoading: trendsLoading } = useTrendsAnalytics();
  const chartColors = useChartColors();

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
          <div className="h-8 w-1/4 rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border bg-card p-6">
                <div className="mb-2 h-4 w-1/4 rounded bg-muted" />
                <div className="h-8 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
          <div className="mt-8 h-64 rounded bg-muted" />
        </div>
      </div>
    );
  }

  const a = analytics?.data;
  const p = performance?.data;
  const g = geographical?.data;
  const t = trends?.data;

  // Prepare chart data (typed — backend shapes from analytics.type.ts)
  const dailyOutageData =
    t?.dailyOutages?.slice(-30).map((day) => ({
      date: day.date,
      count: day.count,
    })) || [];

  const peakHoursData =
    t?.peakLoadSheddingHours?.map((hour) => ({
      name: `${hour.hour}:00`,
      value: hour.count,
    })) || [];

  const outageByAreaData =
    g?.outageByArea?.slice(0, 10).map((area) => ({
      name: area.areaName,
      value: area.outageCount,
    })) || [];

  const topFeedersData =
    g?.topWorstFeeders?.slice(0, 10).map((feeder) => ({
      name: feeder.feederName,
      value: feeder.outageCount,
    })) || [];

  const technicianWorkloadData =
    p?.technicianWorkload?.map((tech) => ({
      name: tech.technicianName,
      assigned: tech.assignedCount,
      resolved: tech.resolvedCount,
    })) || [];

  const totalTrendOutages =
    t?.dailyOutages?.reduce((sum, d) => sum + d.count, 0) || 0;

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Operational Analytics"
        description="Real-time performance metrics and grid insights."
        status={
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />
            Live backend telemetry
          </span>
        }
      />

      {/* Key metrics */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OperationalMetric
          label="Active Outages"
          value={a?.activeOutages || 0}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <OperationalMetric
          label="Priority Outages"
          value={a?.priorityOutages || 0}
          icon={<Target className="h-5 w-5" />}
        />
        <OperationalMetric
          label="Available Techs"
          value={`${asCount(a?.availableTechnicians)} / ${a?.totalTechnicians || 0}`}
          icon={<Users className="h-5 w-5" />}
        />
        <OperationalMetric
          label="Active Schedules"
          value={a?.activeSchedules || 0}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Performance metrics */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <TelemetryRow
                label="MTTR (Mean Time To Resolution)"
                value={`${p?.mttr || 0}h`}
              />
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-electric-blue transition-all"
                  style={{
                    width: `${Math.min(((p?.mttr || 0) / 48) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Target: &lt; 24h
              </p>
            </div>

            <div>
              <TelemetryRow
                label="Avg Assignment Time"
                value={`${p?.avgAssignmentTime || 0}h`}
              />
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald transition-all"
                  style={{
                    width: `${Math.min(((p?.avgAssignmentTime || 0) / 24) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Target: &lt; 4h
              </p>
            </div>

            <div>
              <TelemetryRow
                label="First-Time Fix Rate"
                value={`${p?.firstTimeFixRate || 0}%`}
              />
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${p?.firstTimeFixRate || 0}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
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
                color={chartColors.primary}
              />
            ) : (
              <EmptyState
                icon={<Users className="h-5 w-5" />}
                title="No workload data available"
                description="Technician assignments will appear here."
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Geographical analytics */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
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
                color={chartColors.primary}
              />
            ) : (
              <EmptyState
                icon={<MapPin className="h-5 w-5" />}
                title="No geographical data available"
                description="Area-level outage distribution will appear here."
              />
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
                color={chartColors.destructive}
              />
            ) : (
              <EmptyState
                icon={<Target className="h-5 w-5" />}
                title="No critical feeders identified"
                description="Feeders with repeated outages will appear here."
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      <div className="grid gap-6 md:grid-cols-2">
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
                  color={chartColors.primary}
                  showArea={true}
                />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Total:{" "}
                  <span className="font-mono font-medium tabular-nums text-foreground">
                    {totalTrendOutages}
                  </span>{" "}
                  outages
                </p>
              </>
            ) : (
              <EmptyState
                icon={<TrendingUp className="h-5 w-5" />}
                title="No trend data available"
                description="Daily outage history will appear here."
              />
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
                color={chartColors.secondary}
              />
            ) : (
              <EmptyState
                icon={<Clock className="h-5 w-5" />}
                title="No load-shedding data available"
                description="Peak-hour distribution will appear here."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
