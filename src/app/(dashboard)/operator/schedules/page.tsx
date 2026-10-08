"use client";

import {
  Calendar,
  Clock,
  Loader2,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState, ErrorState, PageHeader } from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  useAuth,
  useDeleteSchedule,
  useSchedules,
  useUpdateScheduleStatus,
} from "@/hooks";
import type { ScheduleStatus } from "@/types";

const statusOptions: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Status" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const assignableStatuses: ScheduleStatus[] = [
  "SCHEDULED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
];

/** Map schedule status to a semantic Badge variant. */
function scheduleVariant(status: string) {
  if (status === "SCHEDULED") return "info" as const;
  if (status === "ONGOING") return "warning" as const;
  if (status === "COMPLETED") return "success" as const;
  return "secondary" as const;
}

export default function OperatorSchedulesPage() {
  const { isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const {
    data: schedules,
    isLoading,
    error,
    refetch,
  } = useSchedules({
    searchTerm: searchTerm || undefined,
    status:
      statusFilter !== "all" ? [statusFilter as ScheduleStatus] : undefined,
    page,
    limit,
    sortBy: "startTime",
    sortOrder: "asc",
  });

  const updateStatus = useUpdateScheduleStatus();
  const deleteSchedule = useDeleteSchedule();

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

  const rows = schedules?.data ?? [];
  const busy = updateStatus.isPending;

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Load-Shedding Schedules"
        description="Manage scheduled power outages."
        actions={
          <Link href="/operator/schedules/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Schedule
            </Button>
          </Link>
        }
        status={
          schedules?.meta ? (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="font-mono tabular-nums">
                {schedules.meta.total} schedules
              </span>
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
                  aria-label="Search schedules"
                  placeholder="Search schedules..."
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

      {/* Schedules table */}
      <Card>
        <CardHeader>
          <CardTitle>All Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <ErrorState
              title="Failed to load schedules"
              message="The schedule feed could not be reached. Check your connection and try again."
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
                      <TableHead>Title</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Feeder</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recurrence</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="py-8 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="py-4">
                          <EmptyState
                            icon={<Clock className="h-5 w-5" />}
                            title={
                              searchTerm || statusFilter !== "all"
                                ? "No schedules match your filters"
                                : "No schedules found"
                            }
                            description="Load-shedding schedules will appear here."
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((schedule) => (
                        <TableRow
                          key={schedule.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            {schedule.title}
                          </TableCell>
                          <TableCell>{schedule.area?.name || "N/A"}</TableCell>
                          <TableCell>
                            {schedule.feeder?.name || "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm">
                            {new Date(schedule.startTime).toLocaleString()}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm">
                            {new Date(schedule.endTime).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={schedule.status}
                              disabled={busy}
                              onValueChange={(v) =>
                                updateStatus.mutate({
                                  id: schedule.id,
                                  payload: {
                                    status: v as ScheduleStatus,
                                  },
                                })
                              }
                            >
                              <SelectTrigger
                                aria-label={`Change status for ${schedule.title}`}
                                className="h-8 w-36"
                              >
                                <Badge
                                  variant={scheduleVariant(schedule.status)}
                                  className="pointer-events-none"
                                >
                                  {schedule.status}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                {assignableStatuses.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {schedule.recurrence || "One-time"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                title={`Delete ${schedule.title}`}
                                className="text-destructive hover:text-destructive"
                                onClick={() =>
                                  setDeleteTarget({
                                    id: schedule.id,
                                    title: schedule.title,
                                  })
                                }
                              >
                                <Trash2
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {schedules?.meta && schedules.meta.totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, schedules.meta.total)} of{" "}
                      {schedules.meta.total} schedules
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
                    totalPages={schedules.meta.totalPages}
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

      {/* Delete confirmation */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete schedule?</DialogTitle>
            <DialogDescription>
              This permanently removes “{deleteTarget?.title}”. Customers in the
              affected area will no longer see this planned outage. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteSchedule.isPending}
              onClick={() => {
                if (deleteTarget) {
                  deleteSchedule.mutate(deleteTarget.id, {
                    onSuccess: () => setDeleteTarget(null),
                  });
                }
              }}
            >
              {deleteSchedule.isPending ? "Deleting…" : "Delete schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
