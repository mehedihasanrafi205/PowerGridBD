"use client";

import { useSearchParams } from "next/navigation";
import { OutageDispatchDetail } from "@/components/dashboard";

export default function OperatorOutageDetailPage() {
  const searchParams = useSearchParams();
  const outageId = searchParams.get("id") ?? "";

  return (
    <OutageDispatchDetail
      outageId={outageId}
      backHref="/operator/outages"
      backLabel="Back to Outages"
    />
  );
}
