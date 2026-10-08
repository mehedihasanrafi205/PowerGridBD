"use client";

import { CalendarClock, Clock, Loader2, Search } from "lucide-react";
import { useState } from "react";
import {
  EmptyState,
  ErrorState,
  GridStatusIndicator,
  PageHeader,
  ScheduleTimeline,
} from "@/components/dashboard";
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
import { useAreas, useAuth, useSchedules } from "@/hooks";
import type { ScheduleStatus } from "@/types";

const statusOptions: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Status" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

/** Map schedule status to a semantic Badge variant. */
function scheduleVariant(status: string) {
  if (status === "SCHEDULED") return "info" as const;
  if (status === "ONGOING") return "warning" as const;
  if (status === "COMPLETED") return "success" as const;
  return "secondary" as const;
}

/**
 * Customer load-shedding schedules — read-only visibility into
 * planned and active outages. Filter by area to answer "is MY
 * area affected?", with a timeline of the current result set.
 * All rows come from the real schedules feed.
 */
export default function CustomerSchedulesPage() {
  const { isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: areas } = useAreas({ limit: 100 });
  const {
    data: schedules,
    isLoading,
    error,
    refetch,
  } = useSchedules({
    searchTerm: searchTerm || undefined,
    status:
      statusFilter !== "all" ? [statusFilter as ScheduleStatus] : undefined,
    areaId: areaFilter !== "all" ? areaFilter : undefined,
    page,
    limit,
    sortBy: "startTime",
    sortOrder: "asc",
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

  const rows = schedules?.data ?? [];
  const ongoing = rows.filter((s) => s.status === "ONGOING");

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Load-Shedding Schedules"
        description="Planned and active power outages across the grid."
        status={
          <GridStatusIndicator
            status={ongoing.length > 0 ? "warning" : "operational"}
            label={
              ongoing.length > 0
                ? `${ongoing.length} active shed${ongoing.length === 1 ? "" : "s"}`
                : "No active shedding"
            }
          />
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
                value={areaFilter}
                onValueChange={(v) => {
                  setAreaFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger aria-label="Filter by area" className="w-44">
                  <SelectValue placeholder="Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {(areas?.data || []).map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {/* Happening now */}
      {!error && !isLoading && ongoing.length > 0 && (
        <Card className="mb-6 border-amber/30 bg-amber/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber">
              <Clock className="h-5 w-5" aria-hidden="true" />
              Happening Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 md:grid-cols-2">
              {ongoing.map((schedule) => (
                <li key={schedule.id} className="rounded-lg border bg-card p-4">
                  <p className="font-medium text-foreground">
                    {schedule.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {schedule.area?.name ||
                      schedule.feeder?.name ||
                      "Multiple areas"}{" "}
                    • until {new Date(schedule.endTime).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Interval timeline */}
      {!error && !isLoading && rows.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" aria-hidden="true" />
              Interval Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduleTimeline schedules={rows} />
          </CardContent>
        </Card>
      )}

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
                            icon={<CalendarClock className="h-5 w-5" />}
                            title="No schedules found"
                            description="Try a different area or status filter."
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
                            <Badge variant={scheduleVariant(schedule.status)}>
                              {schedule.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {schedule.recurrence || "One-time"}
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
    </div>
  );
}
