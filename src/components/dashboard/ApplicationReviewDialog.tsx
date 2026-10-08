"use client";

import { Check, X } from "lucide-react";
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
import { useReviewApplication } from "@/hooks";
import { applicationBadgeVariant } from "@/lib/status-variants";
import type { Application } from "@/types";
import { TechnicalDataPanel } from "./TechnicalDataPanel";

interface ApplicationReviewDialogProps {
  application: Application | null;
  onClose: () => void;
}

/** Map application status to a semantic Badge variant. */

function isReviewable(status: string) {
  return status === "PENDING" || status === "UNDER_REVIEW";
}

/**
 * ApplicationReviewDialog — the shared technician-application
 * review workspace.
 *
 * Full applicant detail (contact, experience, skills,
 * motivation, reviewer trail) with approve / reject-with-
 * reason actions wired to useReviewApplication. Used by both
 * the admin and operator application queues.
 */
export function ApplicationReviewDialog({
  application,
  onClose,
}: ApplicationReviewDialogProps) {
  const review = useReviewApplication();
  const [rejectReason, setRejectReason] = useState("");
  const [confirmReject, setConfirmReject] = useState(false);

  const close = () => {
    setConfirmReject(false);
    setRejectReason("");
    onClose();
  };

  const approve = (app: Application) => {
    review.mutate(
      { id: app.id, payload: { status: "APPROVED" } },
      { onSuccess: close },
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
      { onSuccess: close },
    );
  };

  return (
    <Dialog
      open={application !== null}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Application — {application?.name}
          </DialogTitle>
          <DialogDescription>
            Applied on{" "}
            {application?.createdAt
              ? new Date(application.createdAt).toLocaleDateString()
              : "—"}
          </DialogDescription>
        </DialogHeader>

        {application && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={applicationBadgeVariant(application.status)}>
                {application.status}
              </Badge>
              {application.reviewer && (
                <span className="text-xs text-muted-foreground">
                  Reviewed by {application.reviewer.name}
                  {application.reviewedAt
                    ? ` on ${new Date(application.reviewedAt).toLocaleDateString()}`
                    : ""}
                </span>
              )}
            </div>

            <TechnicalDataPanel
              rows={[
                { label: "Email", value: application.email },
                {
                  label: "Phone",
                  value: application.phone,
                  mono: true,
                },
                {
                  label: "Experience",
                  value: `${application.experienceYears ?? application.experience ?? 0} years`,
                  mono: true,
                },
                { label: "Skills", value: application.skills || "—" },
              ]}
            />

            <div>
              <p className="mb-1 text-sm font-medium">Motivation</p>
              <p className="whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                {application.motivation || "—"}
              </p>
            </div>

            {application.rejectionReason && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                <p className="mb-1 text-sm font-medium text-destructive">
                  Rejection reason
                </p>
                <p className="text-sm text-destructive/90">
                  {application.rejectionReason}
                </p>
              </div>
            )}

            {isReviewable(application.status) &&
              (confirmReject ? (
                <div className="space-y-3 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="review-reject-reason">
                      Rejection reason{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional, shared with the applicant)
                      </span>
                    </Label>
                    <Textarea
                      id="review-reject-reason"
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
                      onClick={() => reject(application)}
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
                    onClick={() => approve(application)}
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
          <Button type="button" variant="ghost" onClick={close}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
