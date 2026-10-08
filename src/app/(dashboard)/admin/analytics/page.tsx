"use client";

import {
  AlertTriangle,
  Clock,
  CreditCard,
  MapPin,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  SimpleHorizontalBarChart,
  SimpleLineChart,
  SimplePieChart,
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
  useFinancialAnalytics,
  useGeographicalAnalytics,
  useOperationalAnalytics,
  usePerformanceAnalytics,
  useTrendsAnalytics,
} from "@/hooks";

export default function AdminAnalyticsPage() {
  const { isLoading: authLoading } = useAuth();
  const { data: analytics, isLoading: analyticsLoading } =
    useOperationalAnalytics();
  const { data: financial, isLoading: financialLoading } =
    useFinancialAnalytics();
  const { data: performance, isLoading: performanceLoading } =
    usePerformanceAnalytics();
  const { data: geographical, isLoading: geographicalLoading } =
    useGeographicalAnalytics();
  const { data: trends, isLoading: trendsLoading } = useTrendsAnalytics();
  const chartColors = useChartColors();

  if (
    authLoading ||
    analyticsLoading ||
    financialLoading ||
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
  const f = financial?.data;
  const p = performance?.data;
  const g = geographical?.data;
  const t = trends?.data;

  // Prepare chart data (typed — backend shapes from analytics.type.ts)
  const revenueByTypeData = f?.revenueByType
    ? [
        {
          name: "Priority Restoration",
          value: f.revenueByType.priorityRestoration || 0,
        },
        {
          name: "SLA Subscription",
          value: f.revenueByType.slaSubscription || 0,
        },
      ]
    : [];

  const paymentStatusData = f?.paymentsByStatus
    ? [
        { name: "Success", value: f.paymentsByStatus.success || 0 },
        { name: "Failed", value: f.paymentsByStatus.failed || 0 },
        { name: "Pending", value: f.paymentsByStatus.pending || 0 },
        { name: "Cancelled", value: f.paymentsByStatus.cancelled || 0 },
      ]
    : [];

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

  const totalTrendOutages =
    t?.dailyOutages?.reduce((sum, d) => sum + d.count, 0) || 0;

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Platform Analytics"
        description="Executive overview of platform metrics, financials, and performance."
      />

      {/* Key metrics */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OperationalMetric
          label="Total Users"
          value={a?.totalUsers || 0}
          icon={<Users className="h-5 w-5" />}
        />
        <OperationalMetric
          label="Active Outages"
          value={a?.activeOutages || 0}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <OperationalMetric
          label="Total Revenue"
          value={`BDT ${f?.totalRevenue || 0}`}
          icon={<CreditCard className="h-5 w-5" />}
        />
        <OperationalMetric
          label="SLA Subscriptions"
          value={f?.activeSlaSubscriptions || 0}
          icon={<Shield className="h-5 w-5" />}
        />
      </div>

      {/* Financial overview */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Financial Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-emerald/10 p-4">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-emerald">
                  BDT {f?.totalRevenue || 0}
                </p>
              </div>
              <div className="rounded-lg bg-electric-blue/10 p-4">
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-electric-blue">
                  {f?.successRate || 0}%
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-primary/10 p-4">
                <p className="text-sm text-muted-foreground">
                  Active SLA Subscriptions
                </p>
                <p className="font-mono text-2xl font-bold tabular-nums text-primary">
                  {f?.activeSlaSubscriptions || 0}
                </p>
              </div>
              <div className="rounded-lg bg-amber/10 p-4">
                <p className="text-sm text-muted-foreground">
                  Priority Restoration Revenue
                </p>
                <p className="font-mono text-2xl font-bold tabular-nums text-amber">
                  BDT {f?.revenueByType?.priorityRestoration || 0}
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-electric-blue/10 p-4">
              <p className="text-sm text-muted-foreground">
                SLA Subscription Revenue
              </p>
              <p className="font-mono text-2xl font-bold tabular-nums text-electric-blue">
                BDT {f?.revenueByType?.slaSubscription || 0}
              </p>
            </div>

            {/* Revenue by Type - Bar Chart */}
            <div>
              <p className="mb-3 text-sm text-muted-foreground">
                Revenue by Type
              </p>
              <SimpleHorizontalBarChart
                data={revenueByTypeData}
                dataKey="value"
                nameKey="name"
                height={120}
                color={chartColors.primary}
              />
            </div>

            {/* Revenue Split - Pie Chart */}
            <div>
              <p className="mb-3 text-sm text-muted-foreground">
                Revenue Split
              </p>
              <SimplePieChart
                data={revenueByTypeData}
                dataKey="value"
                nameKey="name"
                height={180}
              />
            </div>

            {/* Payment Status - Bar Chart */}
            <div>
              <p className="mb-3 text-sm text-muted-foreground">
                Payments by Status
              </p>
              <SimpleHorizontalBarChart
                data={paymentStatusData}
                dataKey="value"
                nameKey="name"
                height={160}
                color={chartColors.secondary}
              />
            </div>
          </CardContent>
        </Card>

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

            <div>
              <TelemetryRow
                label="Critical Feeders Down"
                value={a?.criticalFeedersDown || 0}
              />
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-amber transition-all"
                  style={{
                    width: `${Math.min(((a?.criticalFeedersDown || 0) / 10) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Target: 0</p>
            </div>
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
