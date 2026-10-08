"use client";

import {
  Check,
  FileText,
  Loader2,
  Search,
  Shield,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { useApplications, useAuth, useReviewApplication } from "@/hooks";
import type { Application, ApplicationStatus } from "@/types";

const statusOptions: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

/** Map application status to a semantic Badge variant. */
function applicationVariant(status: string) {
  if (status === "PENDING") return "warning" as const;
  if (status === "UNDER_REVIEW") return "info" as const;
  if (status === "APPROVED") return "success" as const;
  if (status === "REJECTED") return "destructive" as const;
  return "secondary" as const;
}

/** Status icon shown inside the badge (never color alone). */
function StatusIcon({ status }: { status: string }) {
  if (status === "APPROVED")
    return <UserCheck className="h-3 w-3" aria-hidden="true" />;
  if (status === "REJECTED")
    return <UserX className="h-3 w-3" aria-hidden="true" />;
  if (status === "UNDER_REVIEW")
    return <Shield className="h-3 w-3" aria-hidden="true" />;
  return <FileText className="h-3 w-3" aria-hidden="true" />;
}

function isReviewable(status: string) {
  return status === "PENDING" || status === "UNDER_REVIEW";
}

export default function AdminApplicationsPage() {
  const { isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<Application | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [confirmReject, setConfirmReject] = useState(false);

  const {
    data: applications,
    isLoading,
    error,
    refetch,
  } = useApplications({
    searchTerm: searchTerm || undefined,
    status:
      statusFilter !== "all" ? (statusFilter as ApplicationStatus) : undefined,
    page,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const review = useReviewApplication();

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

  const rows = applications?.data ?? [];
  const pendingCount = rows.filter((a) => isReviewable(a.status)).length;

  const approve = (app: Application) => {
    review.mutate(
      { id: app.id, payload: { status: "APPROVED" } },
      { onSuccess: () => setSelected(null) },
    );
  };

  const reject = (app: Application) => {
    review.mutate(
      {
        id: app.id,
        payload: {
          status: "REJECTED",
          reason: rejectReason.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setSelected(null);
          setConfirmReject(false);
          setRejectReason("");
        },
      },
    );
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Technician Applications"
        description="Review and approve technician applications."
        status={
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="font-mono tabular-nums">
              {pendingCount} awaiting review on this page
            </span>
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
                  aria-label="Search applications"
                  placeholder="Search applications..."
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
                <SelectTrigger aria-label="Filter by status" className="w-36">
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

      {/* Applications table */}
      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <ErrorState
              title="Failed to load applications"
              message="The application queue could not be reached. Check your connection and try again."
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
                      <TableHead>Application ID</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
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
                            icon={<FileText className="h-5 w-5" />}
                            title="No applications found"
                            description="Technician applications will appear here."
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((app) => (
                        <TableRow key={app.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">
                            #{app.id.slice(0, 8)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {app.name}
                          </TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {app.phone || "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-mono tabular-nums">
                            {app.experienceYears ?? app.experience ?? 0} yrs
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={applicationVariant(app.status)}
                              className="gap-1"
                            >
                              <StatusIcon status={app.status} />
                              {app.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                title={`Review ${app.name}`}
                                onClick={() => {
                                  setSelected(app);
                                  setRejectReason("");
                                  setConfirmReject(false);
                                }}
                              >
                                <FileText
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              </Button>
                              {isReviewable(app.status) && (
                                <>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    title={`Approve ${app.name}`}
                                    className="text-emerald hover:text-emerald"
                                    disabled={review.isPending}
                                    onClick={() => approve(app)}
                                  >
                                    <Check
                                      className="h-4 w-4"
                                      aria-hidden="true"
                                    />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    title={`Reject ${app.name}`}
                                    className="text-destructive hover:text-destructive"
                                    disabled={review.isPending}
                                    onClick={() => {
                                      setSelected(app);
                                      setRejectReason("");
                                      setConfirmReject(true);
                                    }}
                                  >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {applications?.meta && applications.meta.totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, applications.meta.total)} of{" "}
                      {applications.meta.total} applications
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
                    totalPages={applications.meta.totalPages}
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

      {/* Review dialog — full application + decision */}
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            setConfirmReject(false);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Application — {selected?.name}
            </DialogTitle>
            <DialogDescription>
              Applied on{" "}
              {selected?.createdAt
                ? new Date(selected.createdAt).toLocaleDateString()
                : "—"}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={applicationVariant(selected.status)}>
                  {selected.status}
                </Badge>
                {selected.reviewer && (
                  <span className="text-xs text-muted-foreground">
                    Reviewed by {selected.reviewer.name}
                    {selected.reviewedAt
                      ? ` on ${new Date(selected.reviewedAt).toLocaleDateString()}`
                      : ""}
                  </span>
                )}
              </div>

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Email</dt>
                <dd>{selected.email}</dd>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-mono">{selected.phone}</dd>
                <dt className="text-muted-foreground">Experience</dt>
                <dd className="font-mono tabular-nums">
                  {selected.experienceYears ?? selected.experience ?? 0} years
                </dd>
                <dt className="text-muted-foreground">Skills</dt>
                <dd>{selected.skills || "—"}</dd>
              </dl>

              <div>
                <p className="mb-1 text-sm font-medium">Motivation</p>
                <p className="whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                  {selected.motivation || "—"}
                </p>
              </div>

              {selected.rejectionReason && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                  <p className="mb-1 text-sm font-medium text-destructive">
                    Rejection reason
                  </p>
                  <p className="text-sm text-destructive/90">
                    {selected.rejectionReason}
                  </p>
                </div>
              )}

              {isReviewable(selected.status) &&
                (confirmReject ? (
                  <div className="space-y-3 border-t pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="reject-reason">
                        Rejection reason{" "}
                        <span className="font-normal text-muted-foreground">
                          (optional, shared with the applicant)
                        </span>
                      </Label>
                      <Textarea
                        id="reject-reason"
                        placeholder="e.g. Insufficient field experience for high-voltage work…"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setConfirmReject(false)}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        className="flex-1"
                        disabled={review.isPending}
                        onClick={() => reject(selected)}
                      >
                        {review.isPending ? "Rejecting…" : "Confirm rejection"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 border-t pt-4">
                    <Button
                      type="button"
                      className="flex-1 gap-2"
                      disabled={review.isPending}
                      onClick={() => approve(selected)}
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                      {review.isPending ? "Approving…" : "Approve"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className="flex-1 gap-2"
                      disabled={review.isPending}
                      onClick={() => setConfirmReject(true)}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                      Reject
                    </Button>
                  </div>
                ))}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
