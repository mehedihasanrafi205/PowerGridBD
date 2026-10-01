"use client";

import { useAuth } from "@/hooks";
import { useSchedules } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import {
  Search,
  Filter,
  Download,
  Loader2,
  Calendar,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";

export default function OperatorSchedulesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: schedules,
    isLoading,
    error,
  } = useSchedules({
    searchTerm: searchTerm || undefined,
    status: statusFilter !== "all" ? [statusFilter as any] : undefined,
    page,
    limit,
    sortBy: "startTime",
    sortOrder: "asc",
  });

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

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "ACTIVE", label: "Active" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "info";
      case "ACTIVE":
        return "warning";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Load-Shedding Schedules
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage scheduled power outages
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/operator/schedules/create">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schedules..."
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
          </div>
        </CardContent>
      </Card>

      {/* Schedules Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center text-red-500 py-4">
              Failed to load schedules
            </div>
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
                        <TableCell colSpan={8} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : !schedules?.data || schedules.data.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No schedules found
                        </TableCell>
                      </TableRow>
                    ) : (
                      schedules.data.map((schedule) => (
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
                          <TableCell className="text-sm">
                            {new Date(schedule.startTime).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(schedule.endTime).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(schedule.status)}>
                              {schedule.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {schedule.recurrence || "One-time"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/operator/schedules/${schedule.id}/edit`}
                              >
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
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
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, schedules.meta.total)} of{" "}
                    {schedules.meta.total} schedules
                  </p>
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
