"use client";

import { AlertTriangle, Loader2, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState, ErrorState, PageHeader } from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth, useOutages } from "@/hooks";
import type { OutageStatus } from "@/types";

const statusOptions: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "RESTORED", label: "Restored" },
  { value: "CANCELLED", label: "Cancelled" },
];

/** Map outage status to a semantic Badge variant. */
function outageVariant(status: string) {
  if (status === "PENDING") return "warning" as const;
  if (status === "ASSIGNED") return "info" as const;
  if (status === "IN_PROGRESS") return "default" as const;
  if (status === "RESOLVED" || status === "RESTORED") return "success" as const;
  return "secondary" as const;
}

export default function CustomerOutagesPage() {
  const { isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: outages,
    isLoading,
    error,
    refetch,
  } = useOutages({
    searchTerm: searchTerm || undefined,
    status: statusFilter !== "all" ? [statusFilter as OutageStatus] : undefined,
    page,
    limit,
    sortBy: "reportedAt",
    sortOrder: "desc",
  });

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 rounded bg-muted" />
          <div className="h-16 rounded bg-muted" />
        </div>
      </div>
    );
  }

  const rows = outages?.data ?? [];

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="My Outage Reports"
        description="View and manage all your reported power outages."
        actions={
          <Link href="/customer/outage/report">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              Report New Outage
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  aria-label="Search outages"
                  placeholder="Search outages..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="w-64 pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger aria-label="Filter by status" className="w-40">
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
          </div>
        </CardContent>
      </Card>

      {/* Outages table */}
      <Card>
        <CardHeader>
          <CardTitle>Outage Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <ErrorState
              title="Failed to load outages"
              message="Your outage reports could not be reached. Check your connection and try again."
              action={
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Retry
                </button>
              }
            />
          )}

          {!error && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Outage ID</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Reported</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-4">
                          <EmptyState
                            icon={<AlertTriangle className="h-5 w-5" />}
                            title={
                              searchTerm || statusFilter !== "all"
                                ? "No outages match your filters"
                                : "No outage reports yet"
                            }
                            description="Outage reports will appear here."
                            action={
                              <Link href="/customer/outage/report">
                                <Button size="sm">
                                  Report your first outage
                                </Button>
                              </Link>
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((outage) => (
                        <TableRow key={outage.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            #{outage.id.slice(0, 8)}
                          </TableCell>
                          <TableCell>
                            {outage.area?.name || "Unknown"}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {outage.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant={outageVariant(outage.status)}>
                              {outage.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {outage.isPriority && (
                              <Badge variant="warning" className="gap-1">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                                Priority
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(outage.reportedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              href={`/customer/outage?id=${outage.id}`}
                              className="text-sm text-primary hover:underline"
                            >
                              View
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {outages?.meta && outages.meta.totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, outages.meta.total)} of{" "}
                      {outages.meta.total} reports
                    </p>
                    <Select
                      value={String(limit)}
                      onValueChange={(v) => {
                        setLimit(Number(v));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger
                        aria-label="Rows per page"
                        className="h-8 w-20"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 20, 50].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Pagination
                    page={page}
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
        </CardContent>
      </Card>
    </div>
  );
}
