"use client";

import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  SimpleBarChart,
  SimpleHorizontalBarChart,
  SimpleLineChart,
  SimplePieChart,
} from "@/components/charts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAuth,
  useFinancialAnalytics,
  useGeographicalAnalytics,
  useOperationalAnalytics,
  usePerformanceAnalytics,
  useTrendsAnalytics,
} from "@/hooks";
import { cn } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: analytics, isLoading: analyticsLoading } =
    useOperationalAnalytics();
  const { data: financial, isLoading: financialLoading } =
    useFinancialAnalytics();
  const { data: performance, isLoading: performanceLoading } =
    usePerformanceAnalytics();
  const { data: geographical, isLoading: geographicalLoading } =
    useGeographicalAnalytics();
  const { data: trends, isLoading: trendsLoading } = useTrendsAnalytics();

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
  const f = financial?.data;
  const p = performance?.data;
  const g = geographical?.data;
  const t = trends?.data;

  // Prepare chart data
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
          Platform Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Executive overview of platform metrics, financials, and performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {a?.totalUsers || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-electric-blue/15">
                <Users className="h-6 w-6 text-electric-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Outages</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {a?.activeOutages || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/15">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  BDT {f?.totalRevenue || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald/15">
                <CreditCard className="h-6 w-6 text-emerald" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  SLA Subscriptions
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {f?.activeSlaSubscriptions || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-primary/15">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Financial Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-emerald">
                  BDT {f?.totalRevenue || 0}
                </p>
              </div>
              <div className="p-4 bg-electric-blue/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-electric-blue">
                  {f?.successRate || 0}%
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Active SLA Subscriptions
                </p>
                <p className="text-2xl font-bold text-primary">
                  {f?.activeSlaSubscriptions || 0}
                </p>
              </div>
              <div className="p-4 bg-amber/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Priority Restoration Revenue
                </p>
                <p className="text-2xl font-bold text-amber">
                  BDT {f?.revenueByType?.priorityRestoration || 0}
                </p>
              </div>
            </div>
            <div className="p-4 bg-electric-blue/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                SLA Subscription Revenue
              </p>
              <p className="text-2xl font-bold text-electric-blue">
                BDT {f?.revenueByType?.slaSubscription || 0}
              </p>
            </div>

            {/* Revenue by Type - Bar Chart */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Revenue by Type
              </p>
              <SimpleHorizontalBarChart
                data={revenueByTypeData}
                dataKey="value"
                nameKey="name"
                height={120}
                color="hsl(var(--primary))"
              />
            </div>

            {/* Revenue Split - Pie Chart */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">
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
              <p className="text-sm text-muted-foreground mb-3">
                Payments by Status
              </p>
              <SimpleHorizontalBarChart
                data={paymentStatusData}
                dataKey="value"
                nameKey="name"
                height={160}
                color="hsl(var(--secondary))"
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
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  MTTR (Mean Time To Resolution)
                </span>
                <span className="font-semibold text-electric-blue">
                  {p?.mttr || 0}h
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-electric-blue rounded-full"
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
                <span className="font-semibold text-emerald">
                  {p?.avgAssignmentTime || 0}h
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald rounded-full"
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
                <span className="font-semibold text-primary">
                  {p?.firstTimeFixRate || 0}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${p?.firstTimeFixRate || 0}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Target: &gt; 90%
              </p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  Critical Feeders Down
                </span>
                <span className="font-semibold text-amber">
                  {a?.criticalFeedersDown || 0}
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber rounded-full"
                  style={{
                    width: `${Math.min(((a?.criticalFeedersDown || 0) / 10) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Target: 0</p>
            </div>
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
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
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
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
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
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
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
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p>No load-shedding data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
