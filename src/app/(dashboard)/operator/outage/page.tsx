import { Suspense } from "react";
import OperatorOutageDetailPage from "./[id]/OperatorOutageDetailPage";

export default function OperatorOutagePage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto py-8">Loading outage...</div>}
    >
      <OperatorOutageDetailPage />
    </Suspense>
  );
}
