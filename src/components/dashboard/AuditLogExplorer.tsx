"use client";

import {
  AlertCircle,
  Database,
  FileSearch,
  Loader2,
  Search,
  User,
} from "lucide-react";
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
import { useAuditLogs, useAuth } from "@/hooks";
import { auditActionBadgeVariant } from "@/lib/status-variants";

interface AuditLogExplorerProps {
  title: string;
  description: string;
}

const entityOptions: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Entities" },
  { value: "outage", label: "Outage" },
  { value: "schedule", label: "Schedule" },
  { value: "user", label: "User" },
  { value: "application", label: "Application" },
  { value: "payment", label: "Payment" },
  { value: "zone", label: "Zone" },
  { value: "substation", label: "Substation" },
  { value: "feeder", label: "Feeder" },
  { value: "area", label: "Area" },
];

const actionOptions: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Actions" },
  { value: "CREATE", label: "Create" },
  { value: "UPDATE", label: "Update" },
  { value: "DELETE", label: "Delete" },
  { value: "ASSIGN", label: "Assign" },
  { value: "STATUS_CHANGE", label: "Status Change" },
  { value: "APPROVE", label: "Approve" },
  { value: "REJECT", label: "Reject" },
  { value: "LOGIN", label: "Login" },
  { value: "LOGOUT", label: "Logout" },
];

/** Map audit action to a semantic Badge variant. */

/** Action icon shown inside the badge (never color alone). */
function ActionIcon({ action }: { action: string }) {
  if (action === "CREATE")
    return <Database className="h-3 w-3" aria-hidden="true" />;
  if (action === "UPDATE" || action === "DELETE")
    return <AlertCircle className="h-3 w-3" aria-hidden="true" />;
  if (action === "ASSIGN")
    return <User className="h-3 w-3" aria-hidden="true" />;
  return <Database className="h-3 w-3" aria-hidden="true" />;
}

/**
 * AuditLogExplorer — the shared system-activity trail
 * (Design.md §7 SystemEventFeed pattern).
 *
 * Entity + action filters, search, and paged table with
 * semantic action badges. Shared by the operator and admin
 * audit-log pages, which differ only in title/scope copy.
 */
export function AuditLogExplorer({
  title,
  description,
}: AuditLogExplorerProps) {
  const { isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const {
    data: logs,
    isLoading,
    error,
    refetch,
  } = useAuditLogs({
    searchTerm: searchTerm || undefined,
    entity: entityFilter !== "all" ? entityFilter : undefined,
    action: actionFilter !== "all" ? actionFilter : undefined,
    page,
    limit,
    sortBy: "createdAt",
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

  const rows = logs?.data ?? [];

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title={title}
        description={description}
        status={
          logs?.meta ? (
            <span className="font-mono text-sm tabular-nums text-muted-foreground">
              {logs.meta.total} events
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
                  aria-label="Search audit logs"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="w-64 pl-10"
                />
              </div>
              <Select
                value={entityFilter}
                onValueChange={(v) => {
                  setEntityFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger aria-label="Filter by entity" className="w-36">
                  <SelectValue placeholder="Entity" />
                </SelectTrigger>
                <SelectContent>
                  {entityOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={actionFilter}
                onValueChange={(v) => {
                  setActionFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger aria-label="Filter by action" className="w-40">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.map((opt) => (
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

      {/* Audit logs table */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <ErrorState
              title="Failed to load audit logs"
              message="The activity trail could not be reached. Check your connection and try again."
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
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Entity ID</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-4">
                          <EmptyState
                            icon={<FileSearch className="h-5 w-5" />}
                            title="No audit logs found"
                            description="System events will appear here."
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((log) => (
                        <TableRow key={log.id} className="hover:bg-muted/50">
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User
                                className="h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                              />
                              <span className="font-medium">
                                {log.actor?.name || "System"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({log.actor?.role || "N/A"})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={auditActionBadgeVariant(log.action)}
                              className="gap-1"
                            >
                              <ActionIcon action={log.action} />
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {log.entity}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {log.entityId}
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                            {log.metadata
                              ? JSON.stringify(log.metadata)
                              : "No additional details"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {logs?.meta && logs.meta.totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, logs.meta.total)} of{" "}
                      {logs.meta.total} logs
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
                    totalPages={logs.meta.totalPages}
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
