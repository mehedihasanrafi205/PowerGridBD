"use client";

import { useSearchParams } from "next/navigation";
import { OutageDispatchDetail } from "@/components/dashboard";

export default function AdminOutageDetailPage() {
  const searchParams = useSearchParams();
  const outageId = searchParams.get("id") ?? "";

  return (
    <OutageDispatchDetail
      outageId={outageId}
      backHref="/admin/outages"
      backLabel="Back to Outages"
    />
  );
}
