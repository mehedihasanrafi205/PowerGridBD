"use client";

import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  MapPin,
  Shield,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAssignTechnician,
  useDeleteOutage,
  useOutage,
  useUpdateOutageStatus,
  useUsers,
} from "@/hooks";
import type { OutageStatus } from "@/types";
import { ErrorState } from "./ErrorState";
import { GridStatusIndicator } from "./GridStatusIndicator";
import { OutageStatusTimeline } from "./OutageStatusTimeline";

interface OutageDispatchDetailProps {
  outageId: string;
  backHref: string;
  backLabel: string;
}

const lifecycleStatuses: OutageStatus[] = [
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "RESTORED",
  "CANCELLED",
];

/** Map outage status to a semantic Badge variant. */
function outageVariant(status: string) {
  if (status === "PENDING") return "warning" as const;
  if (status === "ASSIGNED") return "info" as const;
  if (status === "IN_PROGRESS") return "default" as const;
  if (status === "RESOLVED" || status === "RESTORED") return "success" as const;
  if (status === "FAILED") return "destructive" as const;
  return "secondary" as const;
}

/**
 * OutageDispatchDetail — the shared operator/admin outage
 * workspace (Design.md dispatch workflow).
 *
 * Header with status + lifecycle timeline, full detail grid,
 * and a dispatch panel: assign technician, advance status
 * with optional notes, delete behind confirmation. All
 * actions use real backend mutations.
 */
export function OutageDispatchDetail({
  outageId,
  backHref,
  backLabel,
}: OutageDispatchDetailProps) {
  const { data: outage, isLoading, error, refetch } = useOutage(outageId);
  const { data: technicians } = useUsers({ role: "TECHNICIAN", limit: 100 });

  const assignTechnician = useAssignTechnician();
  const updateStatus = useUpdateOutageStatus();
  const deleteOutage = useDeleteOutage();

  const [technicianId, setTechnicianId] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-muted" />
          <div className="h-64 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !outage?.data) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <Card>
          <CardContent className="py-4">
            <ErrorState
              title="Outage not found"
              message="The outage report doesn't exist or has been removed."
              action={
                <>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="mr-3 text-sm font-medium text-primary hover:underline"
                  >
                    Retry
                  </button>
                  <Link href={backHref}>
                    <Button>{backLabel}</Button>
                  </Link>
                </>
              }
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const o = outage.data;
  const busy = assignTechnician.isPending || updateStatus.isPending;

  return (
    <div className="container mx-auto max-w-4xl py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={backHref}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
              Outage #{o.id.slice(0, 8)}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Reported on {new Date(o.reportedAt).toLocaleDateString()} at{" "}
              {new Date(o.reportedAt).toLocaleTimeString()}
            </p>
            <div className="mt-5 max-w-2xl">
              <OutageStatusTimeline currentStatus={o.status} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={outageVariant(o.status)}
              className="gap-1 px-3 py-1"
            >
              {o.status}
            </Badge>
            {o.isPriority && (
              <Badge variant="warning" className="gap-1 px-3 py-1">
                <Shield className="h-3 w-3" aria-hidden="true" />
                Priority
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>Outage Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                <dt className="text-muted-foreground">Outage ID</dt>
                <dd className="font-mono font-medium">#{o.id}</dd>
                <dt className="text-muted-foreground">Area</dt>
                <dd className="flex items-center gap-2">
                  <MapPin
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {o.area?.name || "Unknown"}
                </dd>
                <dt className="text-muted-foreground">Feeder</dt>
                <dd>{o.feeder?.name || "N/A"}</dd>
                <dt className="text-muted-foreground">Substation</dt>
                <dd>{o.feeder?.substation?.name || "N/A"}</dd>
                <dt className="text-muted-foreground">Zone</dt>
                <dd>{o.feeder?.substation?.zone?.name || "N/A"}</dd>
                <dt className="text-muted-foreground">Customer</dt>
                <dd>{o.customer?.name || "Unknown"}</dd>
                <dt className="text-muted-foreground">Technician</dt>
                <dd>{o.technician?.name || "Unassigned"}</dd>
                <dt className="text-muted-foreground">Last Updated</dt>
                <dd>
                  {o.updatedAt ? new Date(o.updatedAt).toLocaleString() : "N/A"}
                </dd>
              </div>
            </dl>

            <h3 className="mb-2 mt-6 border-b pb-2 font-semibold">
              Description
            </h3>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {o.description}
            </p>

            {o.location && (
              <>
                <h3 className="mb-2 mt-6 border-b pb-2 font-semibold">
                  Location
                </h3>
                <p className="font-mono text-sm tabular-nums text-muted-foreground">
                  Lat: {o.location.latitude}, Lng: {o.location.longitude}
                </p>
              </>
            )}

            {o.resolutionNotes && (
              <div className="mt-6 rounded-lg border border-emerald/30 bg-emerald/10 p-4">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-emerald">
                  <CheckCircle className="h-5 w-5" aria-hidden="true" />
                  Resolution Notes
                </h3>
                <p className="text-sm text-emerald/90">{o.resolutionNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dispatch panel */}
        <Card>
          <CardHeader>
            <CardTitle>Dispatch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Assign technician */}
            <div className="space-y-2">
              <Label htmlFor="dispatch-technician">Assigned technician</Label>
              <div className="flex gap-2">
                <Select value={technicianId} onValueChange={setTechnicianId}>
                  <SelectTrigger id="dispatch-technician" className="flex-1">
                    <SelectValue
                      placeholder={o.technician?.name || "Select technician…"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(technicians?.data || []).map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  disabled={!technicianId || busy}
                  onClick={() =>
                    assignTechnician.mutate(
                      { id: outageId, technicianId },
                      { onSuccess: () => setTechnicianId("") },
                    )
                  }
                >
                  <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Assign
                </Button>
              </div>
              {o.technician && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" aria-hidden="true" />
                  Currently: {o.technician.name}
                </p>
              )}
            </div>

            {/* Advance status */}
            <div className="space-y-2">
              <Label htmlFor="dispatch-status">Lifecycle status</Label>
              <Select
                value={o.status}
                disabled={busy}
                onValueChange={(v) =>
                  updateStatus.mutate({
                    id: outageId,
                    payload: {
                      status: v as OutageStatus,
                      notes: notes.trim() || undefined,
                    },
                  })
                }
              >
                <SelectTrigger id="dispatch-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lifecycleStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dispatch note */}
            <div className="space-y-2">
              <Label htmlFor="dispatch-notes">
                Dispatch note{" "}
                <span className="font-normal text-muted-foreground">
                  (optional, saved with the next status change)
                </span>
              </Label>
              <Input
                id="dispatch-notes"
                placeholder="e.g. Crew dispatched with spare transformer…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Grid health hint */}
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm">
              <GridStatusIndicator
                status={
                  o.status === "PENDING" || o.status === "ASSIGNED"
                    ? "warning"
                    : o.status === "IN_PROGRESS"
                      ? "maintenance"
                      : "operational"
                }
                label={
                  o.status === "PENDING"
                    ? "Awaiting dispatch"
                    : o.status === "ASSIGNED"
                      ? "Crew assigned"
                      : o.status === "IN_PROGRESS"
                        ? "Field work active"
                        : "Lifecycle complete"
                }
              />
            </div>

            {/* Danger zone */}
            <div className="space-y-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete outage report
              </Button>
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <AlertTriangle
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
                Deletion is permanent. Resolved records are normally kept for
                the audit trail.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation */}
      <Dialog
        open={confirmDelete}
        onOpenChange={(open) => {
          if (!open) setConfirmDelete(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete outage report?</DialogTitle>
            <DialogDescription>
              This permanently removes outage #{o.id.slice(0, 8)} and its
              history. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteOutage.isPending}
              onClick={() => deleteOutage.mutate(outageId)}
            >
              {deleteOutage.isPending ? "Deleting…" : "Delete report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
