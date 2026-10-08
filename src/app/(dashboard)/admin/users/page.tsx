"use client";

import {
  Ban,
  CheckCircle,
  Search,
  Shield,
  Trash2,
  User,
  UserCheck,
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
  useDeleteUser,
  useUpdateUserRole,
  useUpdateUserStatus,
  useUsers,
} from "@/hooks";
import type { Role, UserStatus } from "@/types";

const roleOptions: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Roles" },
  { value: "CUSTOMER", label: "Customer" },
  { value: "TECHNICIAN", label: "Technician" },
  { value: "POWER_OPERATOR", label: "Power Operator" },
  { value: "ADMIN", label: "Admin" },
];

const statusOptions: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "BLOCKED", label: "Blocked" },
];

const assignableRoles: Role[] = [
  "CUSTOMER",
  "TECHNICIAN",
  "POWER_OPERATOR",
  "ADMIN",
];

/** Map user role to a semantic Badge variant. */
function roleVariant(role: string) {
  if (role === "ADMIN") return "destructive" as const;
  if (role === "POWER_OPERATOR") return "warning" as const;
  if (role === "TECHNICIAN") return "success" as const;
  if (role === "CUSTOMER") return "info" as const;
  return "secondary" as const;
}

export default function AdminUsersPage() {
  const { isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useUsers({
    searchTerm: searchTerm || undefined,
    role: roleFilter !== "all" ? (roleFilter as Role) : undefined,
    status: statusFilter !== "all" ? (statusFilter as UserStatus) : undefined,
    page,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const updateRole = useUpdateUserRole();
  const updateStatus = useUpdateUserStatus();
  const deleteUser = useDeleteUser();

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

  const rows = users?.data ?? [];
  const busy = updateRole.isPending || updateStatus.isPending;

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="User Management"
        description="Manage users, roles, and account status."
        status={
          users?.meta ? (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <UserCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="font-mono tabular-nums">
                {users.meta.total} registered users
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
                  aria-label="Search users"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="w-64 pl-10"
                />
              </div>
              <Select
                value={roleFilter}
                onValueChange={(v) => {
                  setRoleFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger aria-label="Filter by role" className="w-36">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
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

      {/* Users table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <ErrorState
              title="Failed to load users"
              message="The user directory could not be reached. Check your connection and try again."
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
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>SLA</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center">
                          <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </TableCell>
                      </TableRow>
                    ) : rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-4">
                          <EmptyState
                            icon={<User className="h-5 w-5" />}
                            title="No users found"
                            description="Users matching your filters will appear here."
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((u) => (
                        <TableRow key={u.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-sm font-medium text-primary">
                                  {u.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{u.name}</p>
                                <p className="font-mono text-xs text-muted-foreground">
                                  #{u.id.slice(0, 8)}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Select
                              value={u.role}
                              disabled={busy}
                              onValueChange={(v) =>
                                updateRole.mutate({
                                  id: u.id,
                                  payload: { role: v as Role },
                                })
                              }
                            >
                              <SelectTrigger
                                aria-label={`Change role for ${u.name}`}
                                className="h-8 w-40"
                              >
                                <Badge
                                  variant={roleVariant(u.role)}
                                  className="pointer-events-none"
                                >
                                  {u.role}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                {assignableRoles.map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                u.status === "ACTIVE"
                                  ? "success"
                                  : "destructive"
                              }
                            >
                              {u.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {u.slaActive ? (
                              <Badge variant="success" className="gap-1">
                                <Shield
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={busy}
                                title={
                                  u.status === "ACTIVE"
                                    ? `Block ${u.name}`
                                    : `Unblock ${u.name}`
                                }
                                onClick={() =>
                                  updateStatus.mutate({
                                    id: u.id,
                                    payload: {
                                      status:
                                        u.status === "ACTIVE"
                                          ? "BLOCKED"
                                          : "ACTIVE",
                                    },
                                  })
                                }
                              >
                                {u.status === "ACTIVE" ? (
                                  <Ban className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                  <CheckCircle
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                )}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                title={`Delete ${u.name}`}
                                className="text-destructive hover:text-destructive"
                                onClick={() =>
                                  setDeleteTarget({ id: u.id, name: u.name })
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
              {users?.meta && users.meta.totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, users.meta.total)} of{" "}
                      {users.meta.total} users
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
                    totalPages={users.meta.totalPages}
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
            <DialogTitle>Delete user?</DialogTitle>
            <DialogDescription>
              This permanently removes {deleteTarget?.name} and their access.
              This action cannot be undone. Consider blocking the account
              instead.
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
              disabled={deleteUser.isPending}
              onClick={() => {
                if (deleteTarget) {
                  deleteUser.mutate(deleteTarget.id, {
                    onSuccess: () => setDeleteTarget(null),
                  });
                }
              }}
            >
              {deleteUser.isPending ? "Deleting…" : "Delete user"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
