export default function TechnicianDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Technician Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your assigned outage tasks.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">Assigned Tasks</div>
          <div className="text-3xl font-bold text-foreground mt-1">0</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">In Progress</div>
          <div className="text-3xl font-bold text-foreground mt-1">0</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">
            Resolved This Month
          </div>
          <div className="text-3xl font-bold text-foreground mt-1">0</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">
            Avg Resolution Time
          </div>
          <div className="text-3xl font-bold text-foreground mt-1">N/A</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="/technician/outages"
            className="inline-flex items-center gap-2 bg-emerald text-emerald-foreground px-6 py-3 rounded-lg font-semibold hover:bg-emerald/90 transition-colors"
          >
            View All Assigned Outages
          </a>
          <a
            href="/technician/summary"
            className="inline-flex items-center gap-2 border border-border bg-background px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
          >
            View Performance Summary
          </a>
        </div>
      </div>

      {/* Assigned Outages */}
      <div className="bg-card border rounded-xl">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">Assigned Outages</h2>
        </div>
        <div className="p-4 text-center text-muted-foreground">
          No outages assigned at this time. Great work!
        </div>
      </div>
    </div>
  );
}
