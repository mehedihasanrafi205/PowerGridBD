"use client";

import {
  AlertTriangle,
  Loader2,
  MapPin,
  Search,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState, ErrorState, PageHeader } from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
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
import { outageBadgeVariant } from "@/lib/status-variants";
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

export default function OperatorOutagesPage() {
  const { isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
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
    isPriority:
      priorityFilter !== "all" ? priorityFilter === "true" : undefined,
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
          <div className="h-64 rounded bg-muted" />
        </div>
      </div>
    );
  }

  const rows = outages?.data ?? [];

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Outage Management"
        description="View and manage all outage reports."
        status={
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle
              className="h-4 w-4 text-primary"
              aria-hidden="true"
            />
            {outages?.meta ? (
              <span className="font-mono tabular-nums">
                {outages.meta.total} total reports
              </span>
            ) : (
              "Live outage feed"
            )}
          </span>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
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
              <Select
                value={priorityFilter}
                onValueChange={(v) => {
                  setPriorityFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger aria-label="Filter by priority" className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="all">
                    All
                  </SelectItem>
                  <SelectItem key="true" value="true">
                    Priority Only
                  </SelectItem>
                  <SelectItem key="false" value="false">
                    Normal Only
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outages table */}
      <Card>
        <CardHeader>
          <CardTitle>All Outages</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <ErrorState
              title="Failed to load outages"
              message="The outage feed could not be reached. Check your connection and try again."
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
                      <TableHead>Customer</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Reported</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="py-8 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="py-4">
                          <EmptyState
                            icon={<AlertTriangle className="h-5 w-5" />}
                            title={
                              searchTerm || statusFilter !== "all"
                                ? "No outages match your filters"
                                : "No outages found"
                            }
                            description="Outage reports will appear here."
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((outage) => (
                        <TableRow key={outage.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">
                            #{outage.id.slice(0, 8)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User
                                className="h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                              />
                              {outage.customer?.name || "Unknown"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin
                                className="h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                              />
                              {outage.area?.name || "Unknown"}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {outage.description}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={outageBadgeVariant(outage.status)}
                              className="gap-1"
                            >
                              {outage.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {outage.isPriority ? (
                              <Badge variant="warning" className="gap-1">
                                <Shield
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                />
                                Priority
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                Normal
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {outage.technician ? (
                              <div className="flex items-center gap-2">
                                <User
                                  className="h-4 w-4 text-muted-foreground"
                                  aria-hidden="true"
                                />
                                {outage.technician.name}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">
                                Unassigned
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(outage.reportedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              href={`/operator/outage?id=${outage.id}`}
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              Manage
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
                      {outages.meta.total} outages
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
