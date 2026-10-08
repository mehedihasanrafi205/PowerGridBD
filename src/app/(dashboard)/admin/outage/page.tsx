import { Suspense } from "react";
import AdminOutageDetailPage from "./[id]/AdminOutageDetailPage";

export default function AdminOutagePage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto py-8">Loading outage...</div>}
    >
      <AdminOutageDetailPage />
    </Suspense>
  );
}
