"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { useOutages } from "@/hooks/outage.hook";
import { cn } from "@/lib/utils";
import { Search, Filter, Download } from "lucide-react";
import Link from "next/link";

export default function CustomerOutagesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: outages, isLoading, error } = useOutages({
    searchTerm: searchTerm || undefined,
    status: statusFilter !== "all" ? [statusFilter as any] : undefined,
    page,
    limit,
    sortBy: "reportedAt",
    sortOrder: "desc",
  });

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 bg-muted rounded" />
          <div className="h-16 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "ASSIGNED", label: "Assigned" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "RESTORED", label: "Restored" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "warning";
      case "ASSIGNED": return "info";
      case "IN_PROGRESS": return "default";
      case "RESOLVED": return "success";
      case "RESTORED": return "success";
      case "CANCELLED": return "secondary";
      default: return "secondary";
    }
  };

  const renderOutageRows = () => {
    if (error) {
      return (
        <tr>
          <td colSpan={7} className="px-4 py-8 text-center text-red-500">
            Failed to load outages
          </td>
        </tr>
      );
    }

    if (!outages?.data?.length) {
      return (
        <tr>
          <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
            No outage reports found.
            <Link href="/customer/outage/report" className="text-primary hover:underline ml-2">
              Report your first outage
            </Link>
          </td>
        </tr>
      );
    }

    return outages.data.map((outage) => (
      <tr key={outage.id} className="border-b border-border/50 hover:bg-muted/50">
        <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
          #{outage.id.slice(0, 8)}
        </td>
        <td className="px-4 py-3 text-sm">
          {outage.area?.name || "Unknown"}
        </td>
        <td className="px-4 py-3 text-sm max-w-xs truncate">
          {outage.description}
        </td>
        <td className="px-4 py-3">
          <Badge variant={getStatusColor(outage.status)}>
            {outage.status}
          </Badge>
        </td>
        <td className="px-4 py-3">
          {outage.isPriority && (
            <Badge variant="warning" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
              Priority
            </Badge>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-muted-foreground">
          {new Date(outage.reportedAt).toLocaleDateString()}
        </td>
        <td className="px-4 py-3">
          <Link
            href={`/customer/outage/${outage.id}`}
            className="text-sm text-primary hover:underline"
          >
            View
          </Link>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Outage Reports</h1>
        <p className="text-muted-foreground mt-1">View and manage all your reported power outages.</p>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search outages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Outages Table */}
      <div className="bg-card border rounded-xl">
        <div className="border-b p-4 flex items-center justify-between">
          <CardTitle className="text-xl">Outage Reports</CardTitle>
          <Link href="/customer/outage/report">
            <Button>
              <span className="h-4 w-4 mr-2">+</span>
              Report New Outage
            </Button>
          </Link>
        </div>

        {error && (
          <div className="p-4 text-center text-red-500">
            Failed to load outages. Please try again.
          </div>
        )}

        {!error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Outage ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Area</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Priority</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reported</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {renderOutageRows()}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {outages?.meta && outages.meta.totalPages > 1 && (
              <div className="border-t p-4">
                <Pagination
                  page={outages.meta.page}
                  totalPages={outages.meta.totalPages}
                  onPageChange={setPage}
                  showFirstLast
                  showPageNumbers
                  maxPageNumbers={5}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING": return "warning";
    case "ASSIGNED": return "info";
    case "IN_PROGRESS": return "default";
    case "RESOLVED": return "success";
    case "RESTORED": return "success";
    case "CANCELLED": return "secondary";
    default: return "secondary";
  }
}