import { Suspense } from "react";
import TechnicianOutageDetailPage from "./[id]/TechnicianOutageDetailPage";

export default function TechnicianOutagePage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto py-8">Loading outage...</div>}
    >
      <TechnicianOutageDetailPage />
    </Suspense>
  );
}
