"use client";

import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePayment } from "@/hooks";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const transactionId =
    searchParams.get("tran_id") || searchParams.get("transactionId") || "";

  const { data, isLoading } = usePayment(transactionId);
  const payment = data?.data ?? null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <Card>
          <CardContent className="space-y-4 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald/10">
              <CheckCircle
                className="h-6 w-6 text-emerald"
                aria-hidden="true"
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Payment successful
            </h1>
            {isLoading ? (
              <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading your receipt…
              </p>
            ) : payment ? (
              <div className="text-left">
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-lg bg-muted/50 p-4 text-sm">
                  <dt className="text-muted-foreground">Transaction</dt>
                  <dd className="font-mono">{payment.transactionId}</dd>
                  <dt className="text-muted-foreground">Amount</dt>
                  <dd className="font-mono font-semibold tabular-nums">
                    {payment.currency} {payment.amount.toLocaleString()}
                  </dd>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-medium text-emerald">{payment.status}</dd>
                </dl>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {transactionId
                  ? "Your receipt details are being confirmed. Check your payment history for the final record."
                  : "Your payment was confirmed. Check your payment history for the receipt."}
              </p>
            )}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/customer/payments">
                <Button className="w-full sm:w-auto">
                  View payment history
                </Button>
              </Link>
              <Link href="/customer">
                <Button variant="outline" className="w-full sm:w-auto">
                  Back to dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto py-8">Loading receipt…</div>}
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
