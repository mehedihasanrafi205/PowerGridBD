"use client";

import { useAuth } from "@/hooks";
import { useOutage } from "@/hooks";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export default function CustomerOutageDetailPage() {
  const params = useParams();
  const outageId = params.id as string;
  const { user, isLoading: authLoading } = useAuth();
  const { data: outage, isLoading, error } = useOutage(outageId);
  const [activeTab, setActiveTab] = useState("details");

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !outage?.data) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Outage Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The outage report you're looking for doesn't exist or has been
              removed.
            </p>
            <Link href="/customer/outages">
              <Button>Back to My Outages</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const o = outage.data;
  const statusColors: Record<
    string,
    "default" | "secondary" | "destructive" | "success" | "warning" | "info"
  > = {
    PENDING: "warning",
    ASSIGNED: "info",
    IN_PROGRESS: "default",
    RESOLVED: "success",
    RESTORED: "success",
    CANCELLED: "secondary",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <AlertTriangle className="h-4 w-4" />,
    ASSIGNED: <User className="h-4 w-4" />,
    IN_PROGRESS: <Clock className="h-4 w-4" />,
    RESOLVED: <CheckCircle className="h-4 w-4" />,
    RESTORED: <CheckCircle className="h-4 w-4" />,
    CANCELLED: <Info className="h-4 w-4" />,
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Outage #{o.id.slice(0, 8)}
          </h1>
          <p className="text-muted-foreground mt-1">
            Reported on {new Date(o.reportedAt).toLocaleDateString()} at{" "}
            {new Date(o.reportedAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={statusColors[o.status] || "secondary"}
            className="text-lg px-4 py-2 gap-2"
          >
            {statusIcons[o.status] || <Info className="h-4 w-4" />}
            {o.status}
          </Badge>
          {o.isPriority && (
            <Badge variant="warning" className="gap-1">
              <Shield className="h-3 w-3" />
              Priority
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Details</CardTitle>
            <div className="flex gap-2" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === "details"}
                onClick={() => setActiveTab("details")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === "details"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                Details
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "timeline"}
                onClick={() => setActiveTab("timeline")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === "timeline"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                Timeline
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Basic Information
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                      <dt className="text-muted-foreground">Outage ID</dt>
                      <dd className="font-mono font-medium">#{o.id}</dd>
                      <dt className="text-muted-foreground">Area</dt>
                      <dd className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {o.area?.name || "Unknown"}
                      </dd>
                      <dt className="text-muted-foreground">Feeder</dt>
                      <dd>{o.feeder?.name || "N/A"}</dd>
                      <dt className="text-muted-foreground">Substation</dt>
                      <dd>{o.feeder?.substation?.name || "N/A"}</dd>
                      <dt className="text-muted-foreground">Zone</dt>
                      <dd>{o.feeder?.substation?.zone?.name || "N/A"}</dd>
                    </div>
                  </dl>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Status Details
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                      <dt className="text-muted-foreground">Current Status</dt>
                      <dd>
                        <Badge variant={statusColors[o.status] || "secondary"}>
                          {o.status}
                        </Badge>
                      </dd>
                      <dt className="text-muted-foreground">Priority</dt>
                      <dd>{o.isPriority ? "Yes" : "No"}</dd>
                      <dt className="text-muted-foreground">Reported At</dt>
                      <dd>{new Date(o.reportedAt).toLocaleString()}</dd>
                      <dt className="text-muted-foreground">Last Updated</dt>
                      <dd>
                        {o.updatedAt
                          ? new Date(o.updatedAt).toLocaleString()
                          : "N/A"}
                      </dd>
                      <dt className="text-muted-foreground">
                        Assigned Technician
                      </dt>
                      <dd>{o.technician?.name || "Not assigned"}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-lg border-b pb-2 mb-3">
                  Description
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {o.description}
                </p>
              </div>

              {/* Location */}
              {o.location && (
                <div>
                  <h3 className="font-semibold text-lg border-b pb-2 mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </h3>
                  <p className="text-muted-foreground">
                    Lat: {o.location.latitude}, Lng: {o.location.longitude}
                  </p>
                </div>
              )}

              {/* Assigned Technician */}
              {o.technician && (
                <div>
                  <h3 className="font-semibold text-lg border-b pb-2 mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Assigned Technician
                  </h3>
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary">
                        {o.technician.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{o.technician.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {o.technician.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {o.technician.phone || "No phone"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution Notes */}
              {o.resolutionNotes && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Resolution Notes
                  </h3>
                  <p className="text-green-700">{o.resolutionNotes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Status Timeline</h3>
              <div className="relative pl-4 border-l-2 border-muted">
                <div className="relative pb-6 before:absolute before:left-[-6px] before:top-0 before:h-2 before:w-2 before:rounded-full before:bg-primary">
                  <p className="text-sm font-medium">Outage Reported</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(o.reportedAt).toLocaleString()}
                  </p>
                </div>
                {o.assignedAt && (
                  <div className="relative pb-6 before:absolute before:left-[-6px] before:top-0 before:h-2 before:w-2 before:rounded-full before:bg-blue-500">
                    <p className="text-sm font-medium">Technician Assigned</p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(o.assignedAt).toLocaleString()}
                    </p>
                  </div>
                )}
                {o.inProgressAt && (
                  <div className="relative pb-6 before:absolute before:left-[-6px] before:top-0 before:h-2 before:w-2 before:rounded-full before:bg-amber-500">
                    <p className="text-sm font-medium">Work Started</p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(o.inProgressAt).toLocaleString()}
                    </p>
                  </div>
                )}
                {(o.resolvedAt || o.restoredAt) && (
                  <div className="relative before:absolute before:left-[-6px] before:top-0 before:h-2 before:w-2 before:rounded-full before:bg-green-500">
                    <p className="text-sm font-medium">
                      {o.restoredAt ? "Power Restored" : "Issue Resolved"}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(o.restoredAt || o.resolvedAt!).toLocaleString()}
                    </p>
                    {o.resolutionNotes && (
                      <p className="text-sm text-green-700 mt-1">
                        {o.resolutionNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Back Link */}
      <div className="mt-6">
        <Link
          href="/customer/outages"
          className="text-primary hover:underline flex items-center gap-1"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to My Outages
        </Link>
      </div>
    </div>
  );
}
