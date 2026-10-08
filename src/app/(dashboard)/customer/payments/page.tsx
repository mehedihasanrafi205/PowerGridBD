"use client";

import { Loader2, Receipt, Search } from "lucide-react";
import { useState } from "react";
import {
  EmptyState,
  ErrorState,
  PageHeader,
  PaymentReceiptDialog,
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
import { useAuth, useMyPayments } from "@/hooks";
import type { Payment, PaymentStatus } from "@/types";

const statusOptions: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Status" },
  { value: "SUCCESS", label: "Success" },
  { value: "FAILED", label: "Failed" },
  { value: "PENDING", label: "Pending" },
  { value: "CANCELLED", label: "Cancelled" },
];

/** Map payment status to a semantic Badge variant. */
function paymentVariant(status: string) {
  if (status === "SUCCESS") return "success" as const;
  if (status === "FAILED") return "destructive" as const;
  if (status === "PENDING") return "warning" as const;
  return "secondary" as const;
}

function typeLabel(type: string) {
  if (type === "PRIORITY_RESTORATION") return "Priority Restoration";
  if (type === "SLA_SUBSCRIPTION") return "SLA Subscription";
  return type;
}

export default function CustomerPaymentsPage() {
  const { isLoading: authLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Payment | null>(null);

  const {
    data: payments,
    isLoading,
    error,
    refetch,
  } = useMyPayments({
    page,
    limit,
    searchTerm: searchTerm || undefined,
    status:
      statusFilter !== "all" ? [statusFilter as PaymentStatus] : undefined,
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

  const rows = payments?.data ?? [];

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Payment History"
        description="View all your payment transactions."
        status={
          payments?.meta ? (
            <span className="font-mono text-sm tabular-nums text-muted-foreground">
              {payments.meta.total} transactions
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
                  aria-label="Search payments"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="w-64 pl-10 md:w-80"
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

      {/* Payments table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <ErrorState
              title="Failed to load payments"
              message="Your transactions could not be reached. Check your connection and try again."
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
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right tabular-nums">
                        Amount
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Gateway</TableHead>
                      <TableHead>Date</TableHead>
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
                            icon={<Receipt className="h-5 w-5" />}
                            title="No payments found"
                            description="Completed transactions will appear here."
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((payment) => (
                        <TableRow
                          key={payment.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-mono text-sm">
                            {payment.transactionId}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {typeLabel(payment.type)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium tabular-nums">
                            BDT {payment.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={paymentVariant(payment.status)}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{payment.gateway || "—"}</TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <button
                              type="button"
                              onClick={() => setSelected(payment)}
                              className="text-sm text-primary hover:underline"
                            >
                              View Details
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {payments?.meta && payments.meta.totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, payments.meta.total)} of{" "}
                      {payments.meta.total} payments
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

      {/* Receipt dialog */}
      <PaymentReceiptDialog
        payment={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
