"use client";

import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Info,
  Shield,
} from "lucide-react";
import { EmptyState, PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, useMySummary, useSlaPlans, useSubscribeSla } from "@/hooks";
import { cn } from "@/lib/utils";

export default function CustomerSlaPage() {
  const { isLoading: authLoading } = useAuth();
  const { data: summary, isLoading: summaryLoading } = useMySummary();
  const { data: plans, isLoading: plansLoading } = useSlaPlans();
  const subscribeMutation = useSubscribeSla();

  if (authLoading || summaryLoading || plansLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 bg-muted rounded" />
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border rounded-xl p-6">
                <div className="h-4 w-1/2 bg-muted rounded mb-4" />
                <div className="h-8 w-full bg-muted rounded mb-2" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const expiryDate = summary?.data?.slaExpiryDate;

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="SLA Subscription"
        description="Manage your Service Level Agreement subscription."
        status={
          <span
            className={
              summary?.data?.slaActive
                ? "inline-flex items-center gap-2 text-sm text-emerald"
                : "inline-flex items-center gap-2 text-sm text-muted-foreground"
            }
          >
            <Shield className="h-4 w-4" aria-hidden="true" />
            {summary?.data?.slaActive ? "SLA Active" : "No active SLA"}
          </span>
        }
      />

      {/* Current Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div
              className={cn(
                "p-4 rounded-lg",
                summary?.data?.slaActive
                  ? "bg-emerald/10 border border-emerald/30"
                  : "bg-muted border border-border",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    summary?.data?.slaActive ? "bg-emerald/15" : "bg-muted",
                  )}
                >
                  <Shield
                    className={cn(
                      "h-6 w-6",
                      summary?.data?.slaActive
                        ? "text-emerald"
                        : "text-muted-foreground",
                    )}
                  />
                </div>
                <div>
                  <p className="font-semibold">
                    {summary?.data?.slaActive ? "SLA Active" : "No Active SLA"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {summary?.data?.slaActive
                      ? `Expires: ${expiryDate ? new Date(expiryDate).toLocaleDateString() : "Unknown"}`
                      : "Subscribe to get priority support"}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-electric-blue/10 border border-electric-blue/30 rounded-lg">
              <p className="font-semibold text-electric-blue mb-2">
                Priority Restorations Used
              </p>
              <p className="text-2xl font-bold text-electric-blue">
                {summary?.data?.priorityCount || 0} / month
              </p>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="font-semibold text-primary mb-2">
                Total Investment
              </p>
              <p className="text-2xl font-bold text-primary">
                BDT {summary?.data?.totalPaid || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Available Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!plans?.data || plans.data.length === 0 ? (
            <EmptyState
              icon={<Info className="h-5 w-5" />}
              title="No SLA plans available at the moment"
              description="New plans will appear here when published."
            />
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {plans.data.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow relative"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {plan.description}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="font-mono text-3xl font-bold tabular-nums text-foreground">
                      BDT {plan.price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      / {plan.durationDays} days
                    </p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature: string) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-emerald" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() =>
                      subscribeMutation.mutate({ planId: plan.id })
                    }
                    disabled={
                      subscribeMutation.isPending || summary?.data?.slaActive
                    }
                  >
                    {subscribeMutation.isPending
                      ? "Subscribing..."
                      : summary?.data?.slaActive
                        ? "Already Subscribed"
                        : "Subscribe Now"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Benefits Info */}
      <Card className="mt-8 border-amber/30 bg-amber/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber">
            <AlertCircle className="h-5 w-5" />
            SLA Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid md:grid-cols-2 gap-4 text-sm text-amber">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Priority outage restoration
              (4-hour SLA)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Dedicated support line
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Monthly priority restoration
              credits
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Real-time outage notifications
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Quarterly grid health reports
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Discounted emergency services
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
