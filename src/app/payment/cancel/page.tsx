import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <Card>
          <CardContent className="space-y-4 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber/10">
              <XCircle className="h-6 w-6 text-amber" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Payment cancelled
            </h1>
            <p className="text-sm text-muted-foreground">
              The payment was not completed and no charge was made. Your outage
              report and SLA status are unchanged — you can try again at any
              time.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/customer/payments">
                <Button className="w-full sm:w-auto">
                  View payment history
                </Button>
              </Link>
              <Link href="/customer/sla">
                <Button variant="outline" className="w-full sm:w-auto">
                  Back to SLA plans
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
