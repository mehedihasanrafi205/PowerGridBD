import { Suspense } from "react";
import CustomerOutageDetailPage from "./[id]/CustomerOutageDetailPage";

export default function CustomerOutagePage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto py-8">Loading outage...</div>}
    >
      <CustomerOutageDetailPage />
    </Suspense>
  );
}
