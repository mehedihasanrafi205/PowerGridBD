"use client";

import { useAuth } from "@/hooks";
import { useOutages } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Search, Filter, Download, Loader2, User, AlertTriangle, MapPin, Shield, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";

export default function AdminOutagesPage() {
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
          <div className="h-64 bg-muted rounded" />
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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-primary" />
            Outage Management
          </h1>
          <p className="text-muted-foreground mt-1">View and manage all outage reports across the platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
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
          </div>
        </CardContent>
      </Card>

      {/* Outages Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Outages</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center text-red-500 py-4">Failed to load outages</div>
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
                        <TableCell colSpan={9} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : !outages?.data || outages.data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No outages found
                        </TableCell>
                      </TableRow>
                    ) : (
                      outages.data.map((outage) => (
                        <TableRow key={outage.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">#{outage.id.slice(0, 8)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {outage.customer?.name || "Unknown"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {outage.area?.name || "Unknown"}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{outage.description}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(outage.status)}>
                              {outage.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {outage.isPriority && (
                              <Badge variant="warning" className="gap-1">
                                <Shield className="h-3 w-3" />
                                Priority
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {outage.technician ? (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {outage.technician.name}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(outage.reportedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/admin/outages/${outage.id}`}>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
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
              {outages?.meta && outages.meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, outages.meta.total)} of {outages.meta.total} outages
                  </p>
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