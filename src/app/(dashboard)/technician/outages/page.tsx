"use client";

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  LayoutGrid,
  List,
  Loader2,
  MapPin,
  Search,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  EmptyState,
  ErrorState,
  OutageStatusDialog,
  PageHeader,
} from "@/components/dashboard";
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
import { outageBadgeVariant } from "@/lib/status-variants";
import type { OutageStatus } from "@/types";

const statusOptions: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Status" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "RESTORED", label: "Restored" },
];

/** Map outage status to a semantic Badge variant. */

/** Status icon shown inside the badge (never color alone). */
function StatusIcon({ status }: { status: string }) {
  if (status === "ASSIGNED")
    return <User className="h-3 w-3" aria-hidden="true" />;
  if (status === "IN_PROGRESS")
    return <Clock className="h-3 w-3" aria-hidden="true" />;
  if (status === "RESOLVED" || status === "RESTORED")
    return <CheckCircle className="h-3 w-3" aria-hidden="true" />;
  return <AlertTriangle className="h-3 w-3" aria-hidden="true" />;
}

export default function TechnicianOutagesPage() {
  const { isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [view, setView] = useState<"table" | "kanban">(() => {
    if (typeof window === "undefined") return "table";
    return window.localStorage.getItem("powergridbd-tech-outages-view") ===
      "kanban"
      ? "kanban"
      : "table";
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
          <div className="h-64 rounded bg-muted" />
        </div>
      </div>
    );
  }

  const rows = outages?.data ?? [];

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Assigned Outages"
        description="View and manage all your assigned outage tasks."
        status={
          outages?.meta ? (
            <span className="font-mono text-sm tabular-nums text-muted-foreground">
              {outages.meta.total} assigned
            </span>
          ) : undefined
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outages workspace */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Assigned Tasks</CardTitle>
            <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
              {(
                [
                  { value: "table", label: "Table", icon: List },
                  { value: "kanban", label: "Kanban", icon: LayoutGrid },
                ] as const
              ).map((option) => {
                const Icon = option.icon;
                const active = view === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setView(option.value);
                      try {
                        window.localStorage.setItem(
                          "powergridbd-tech-outages-view",
                          option.value,
                        );
                      } catch {
                        /* persistence unavailable */
                      }
                    }}
                    className={
                      active
                        ? "inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm"
                        : "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    }
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <ErrorState
              title="Failed to load outages"
              message="Your assigned tasks could not be reached. Check your connection and try again."
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

          {!error && view === "kanban" ? (
            <KanbanBoard
              rows={rows}
              isLoading={isLoading}
              onUpdate={(id) => setSelectedId(id)}
            />
          ) : (
            !error && (
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
                              icon={
                                <CheckCircle className="h-5 w-5 text-emerald" />
                              }
                              title="All tasks completed!"
                              description="Great work! No outages assigned at this time."
                            />
                          </TableCell>
                        </TableRow>
                      ) : (
                        rows.map((outage) => (
                          <TableRow
                            key={outage.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-mono text-sm">
                              #{outage.id.slice(0, 8)}
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
                                <StatusIcon status={outage.status} />
                                {outage.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {outage.isPriority && (
                                <Badge variant="warning" className="gap-1">
                                  <Shield
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                  />
                                  Priority
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                              {new Date(outage.reportedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  type="button"
                                  onClick={() => setSelectedId(outage.id)}
                                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                                >
                                  Update
                                </button>
                                <Link
                                  href={`/technician/outage?id=${outage.id}`}
                                  className="text-sm font-medium text-primary hover:underline"
                                >
                                  {outage.status === "ASSIGNED"
                                    ? "Start Work"
                                    : "Continue"}
                                </Link>
                              </div>
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
            )
          )}
        </CardContent>
      </Card>

      {/* Quick status-update dialog */}
      <OutageStatusDialog
        outage={(() => {
          const found = rows.find((o) => o.id === selectedId);
          return found
            ? {
                id: found.id,
                title: found.description.slice(0, 60),
                status: found.status,
              }
            : null;
        })()}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}

/** Kanban columns for the field workflow. */
const KANBAN_COLUMNS = [
  { key: "ASSIGNED", title: "Assigned", dot: "bg-electric-blue" },
  { key: "IN_PROGRESS", title: "In Progress", dot: "bg-amber" },
  { key: "DONE", title: "Done", dot: "bg-emerald" },
] as const;

function KanbanBoard({
  rows,
  isLoading,
  onUpdate,
}: {
  rows: Array<{
    id: string;
    description: string;
    status: string;
    isPriority?: boolean;
    area?: { name?: string } | null;
    reportedAt: string;
  }>;
  isLoading: boolean;
  onUpdate: (id: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-xl border bg-card"
          />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircle className="h-5 w-5 text-emerald" />}
        title="All tasks completed!"
        description="Great work! No outages assigned at this time."
      />
    );
  }

  const columns = KANBAN_COLUMNS.map((col) => ({
    ...col,
    cards: rows.filter((o) =>
      col.key === "DONE"
        ? o.status === "RESOLVED" || o.status === "RESTORED"
        : o.status === col.key,
    ),
  }));

  return (
    <div className="grid items-start gap-4 md:grid-cols-3">
      {columns.map((col) => (
        <div key={col.key} className="rounded-xl border bg-muted/30 p-3">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span
                className={`h-2 w-2 rounded-full ${col.dot}`}
                aria-hidden="true"
              />
              {col.title}
            </span>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {col.cards.length}
            </span>
          </div>
          <div className="space-y-3">
            {col.cards.length === 0 && (
              <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                No cards
              </p>
            )}
            {col.cards.map((outage) => (
              <article
                key={outage.id}
                className="rounded-lg border bg-card p-3.5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    #{outage.id.slice(0, 8)}
                  </span>
                  {outage.isPriority && (
                    <Badge variant="warning" className="gap-1">
                      <Shield className="h-3 w-3" aria-hidden="true" />
                      Priority
                    </Badge>
                  )}
                </div>
                <p className="line-clamp-2 text-sm font-medium text-foreground">
                  {outage.description}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {outage.area?.name || "Unknown"} •{" "}
                  {new Date(outage.reportedAt).toLocaleDateString()}
                </p>
                <div className="mt-3 flex items-center gap-2 border-t pt-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => onUpdate(outage.id)}
                  >
                    Update
                  </Button>
                  <Link
                    href={`/technician/outage?id=${outage.id}`}
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="w-full"
                    >
                      {outage.status === "ASSIGNED" ? "Start Work" : "Continue"}
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
