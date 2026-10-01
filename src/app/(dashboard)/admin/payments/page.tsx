"use client";

import { useAuth } from "@/hooks";
import { useAllPayments } from "@/hooks";
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
  Loader2,
  Download,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";

export default function AdminPaymentsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: payments,
    isLoading,
    error,
  } = useAllPayments({
    searchTerm: searchTerm || undefined,
    status: statusFilter !== "all" ? [statusFilter as any] : undefined,
    type: typeFilter !== "all" ? (typeFilter as any) : undefined,
    page,
    limit,
    sortBy: "createdAt",
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
    { value: "SUCCESS", label: "Success" },
    { value: "FAILED", label: "Failed" },
    { value: "PENDING", label: "Pending" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "PRIORITY_RESTORATION", label: "Priority Restoration" },
    { value: "SLA_SUBSCRIPTION", label: "SLA Subscription" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "success";
      case "FAILED":
        return "destructive";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "PRIORITY_RESTORATION":
        return "Priority Restoration";
      case "SLA_SUBSCRIPTION":
        return "SLA Subscription";
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-primary" />
            Payment Management
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all payment transactions
          </p>
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
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((opt) => (
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

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center text-red-500 py-4">
              Failed to load payments
            </div>
          )}

          {!error && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Gateway</TableHead>
                      <TableHead>Date</TableHead>
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
                    ) : !payments?.data || payments.data.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No payments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      payments.data.map((payment) => (
                        <TableRow
                          key={payment.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-mono text-sm">
                            {payment.transactionId}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {payment.customer?.name || "Unknown"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                #{payment.customer?.id?.slice(0, 8) || "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {getTypeLabel(payment.type)}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            BDT {payment.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{payment.gateway}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              href={`/admin/payments/${payment.id}`}
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
              {payments?.meta && payments.meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, payments.meta.total)} of{" "}
                    {payments.meta.total} payments
                  </p>
                  <Pagination
                    page={page}
                    totalPages={payments.meta.totalPages}
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
