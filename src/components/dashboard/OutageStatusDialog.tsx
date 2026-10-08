"use client";

import { CheckCircle, PlayCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateOutageStatus } from "@/hooks";
import type { OutageStatus } from "@/types";

interface OutageStatusDialogProps {
  outage: { id: string; title: string; status: OutageStatus } | null;
  onClose: () => void;
}

/** Valid technician transitions from each status. */
const NEXT_STATUSES: Partial<Record<OutageStatus, OutageStatus[]>> = {
  ASSIGNED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["RESOLVED", "CANCELLED"],
};

/**
 * OutageStatusDialog — quick field status update.
 *
 * Advances an assigned outage through its valid next states
 * with an optional field note, wired to useUpdateOutageStatus.
 * Used from the technician kanban cards and list rows so
 * simple transitions don't require opening the full detail
 * page. Terminal states render read-only.
 */
export function OutageStatusDialog({
  outage,
  onClose,
}: OutageStatusDialogProps) {
  const updateStatus = useUpdateOutageStatus();
  const [notes, setNotes] = useState("");
  const [lastOutageId, setLastOutageId] = useState<string | null>(null);

  // Fresh notes for each newly opened outage.
  if (outage && outage.id !== lastOutageId) {
    setLastOutageId(outage.id);
    setNotes("");
  }

  const nextStatuses = outage ? (NEXT_STATUSES[outage.status] ?? []) : [];

  const advance = (status: OutageStatus) => {
    if (!outage) return;
    updateStatus.mutate(
      {
        id: outage.id,
        payload: { status, notes: notes.trim() || undefined },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Dialog
      open={outage !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Update status
            {outage && (
              <span className="font-mono font-normal text-muted-foreground">
                {" "}
                #{outage.id.slice(0, 8)}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {outage
              ? `${outage.title} — currently ${outage.status}`
              : "Change the outage status."}
          </DialogDescription>
        </DialogHeader>

        {outage && (
          <div className="space-y-4">
            {nextStatuses.length === 0 ? (
              <p className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                <CheckCircle
                  className="h-4 w-4 text-emerald"
                  aria-hidden="true"
                />
                This outage is in a terminal state — no further transitions.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="outage-status-notes">
                    Field note{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional, saved with the update)
                    </span>
                  </Label>
                  <Textarea
                    id="outage-status-notes"
                    placeholder="e.g. On site, isolating the feeder…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    disabled={updateStatus.isPending}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {nextStatuses.map((status) => (
                    <Button
                      key={status}
                      type="button"
                      variant={status === "CANCELLED" ? "outline" : "default"}
                      disabled={updateStatus.isPending}
                      onClick={() => advance(status)}
                      className="w-full justify-start gap-2"
                    >
                      {status === "IN_PROGRESS" ? (
                        <PlayCircle className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <CheckCircle className="h-4 w-4" aria-hidden="true" />
                      )}
                      {updateStatus.isPending
                        ? "Updating…"
                        : status === "IN_PROGRESS"
                          ? "Start work"
                          : status === "RESOLVED"
                            ? "Mark resolved"
                            : "Cancel outage"}
                    </Button>
                  ))}
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{outage.status}</Badge>
              <span
                className="text-xs text-muted-foreground"
                aria-hidden="true"
              >
                →
              </span>
              <span className="text-xs text-muted-foreground">
                {nextStatuses.length > 0
                  ? nextStatuses.join(", ")
                  : "no transitions"}
              </span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
