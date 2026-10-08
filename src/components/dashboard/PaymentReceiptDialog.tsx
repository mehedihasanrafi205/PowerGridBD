"use client";

import { Receipt } from "lucide-react";
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
import type { Payment } from "@/types";
import { TechnicalDataPanel } from "./TechnicalDataPanel";

interface PaymentReceiptDialogProps {
  payment: Payment | null;
  showPayer?: boolean;
  onClose: () => void;
}

/** Map payment status to a semantic Badge variant. */
function paymentVariant(status: string) {
  if (status === "SUCCESS") return "success" as const;
  if (status === "PENDING") return "warning" as const;
  if (status === "FAILED") return "destructive" as const;
  return "secondary" as const;
}

/**
 * PaymentReceiptDialog — the shared payment receipt viewer.
 *
 * Transaction record with type, amount, status, gateway and
 * card/bank details. Read-only; used by both the customer
 * and admin payment lists (replaces broken detail-route
 * links — no payment detail route exists).
 */
export function PaymentReceiptDialog({
  payment,
  showPayer = false,
  onClose,
}: PaymentReceiptDialogProps) {
  const details = payment?.paymentDetails;
  const validation = details?.validation;
  const payer = payment?.customer || payment?.user;

  return (
    <Dialog
      open={payment !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" aria-hidden="true" />
            Payment Receipt
          </DialogTitle>
          <DialogDescription className="font-mono">
            {payment?.transactionId}
          </DialogDescription>
        </DialogHeader>

        {payment && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={paymentVariant(payment.status)}>
                {payment.status}
              </Badge>
              <Badge variant="secondary">{payment.type}</Badge>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {payment.type === "PRIORITY_RESTORATION"
                  ? "Priority Restoration"
                  : "SLA Subscription"}
              </p>
              <p className="font-mono text-3xl font-bold tabular-nums text-foreground">
                {payment.currency} {payment.amount.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                via {payment.gateway || "SSLCommerz"} •{" "}
                {new Date(payment.createdAt).toLocaleString()}
              </p>
            </div>

            <TechnicalDataPanel
              rows={[
                ...(showPayer && payer
                  ? [
                      {
                        label: "Payer",
                        value: (
                          <>
                            {payer.name}{" "}
                            <span className="text-muted-foreground">
                              ({payer.email})
                            </span>
                          </>
                        ),
                      },
                    ]
                  : []),
                ...(payment.outage
                  ? [
                      {
                        label: "Outage",
                        value: `#${payment.outage.id.slice(0, 8)}`,
                        mono: true,
                      },
                    ]
                  : []),
                ...(validation?.card_type
                  ? [
                      {
                        label: "Card",
                        value: (
                          <>
                            {validation.card_type}{" "}
                            <span className="font-mono">
                              {validation.card_no || ""}
                            </span>
                          </>
                        ),
                      },
                    ]
                  : []),
                ...(validation?.bank_tran_id
                  ? [
                      {
                        label: "Bank Txn",
                        value: validation.bank_tran_id,
                        mono: true,
                      },
                    ]
                  : []),
                ...(validation?.tran_date
                  ? [
                      {
                        label: "Paid At",
                        value: validation.tran_date,
                        mono: true,
                      },
                    ]
                  : []),
                ...(details?.failedreason
                  ? [
                      {
                        label: "Failure",
                        value: (
                          <span className="text-destructive">
                            {details.failedreason}
                          </span>
                        ),
                      },
                    ]
                  : []),
                ...(details?.refund
                  ? [
                      {
                        label: "Refund",
                        value: `${details.refund.status} — ${details.refund.amount}${details.refund.reason ? ` (${details.refund.reason})` : ""}`,
                      },
                    ]
                  : []),
              ]}
            />
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
