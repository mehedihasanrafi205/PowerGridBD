export default function CustomerDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Customer Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your power outage reports.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">Active Outages</div>
          <div className="text-3xl font-bold text-foreground mt-1">0</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">
            Priority Restorations
          </div>
          <div className="text-3xl font-bold text-foreground mt-1">0</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">SLA Status</div>
          <div className="text-3xl font-bold text-foreground mt-1">
            Inactive
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">Total Paid</div>
          <div className="text-3xl font-bold text-foreground mt-1">BDT 0</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="/customer/outage/report"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Report New Outage
          </a>
          <a
            href="/customer/sla"
            className="inline-flex items-center gap-2 border border-border bg-background px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
          >
            Manage SLA Subscription
          </a>
          <a
            href="/customer/payments"
            className="inline-flex items-center gap-2 border border-border bg-background px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
          >
            View Payment History
          </a>
        </div>
      </div>

      {/* Recent Outages */}
      <div className="bg-card border rounded-xl">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">Recent Outage Reports</h2>
        </div>
        <div className="p-4 text-center text-muted-foreground">
          No outage reports yet.
          <a
            href="/customer/outage/report"
            className="text-primary hover:underline ml-2"
          >
            Report your first outage
          </a>
        </div>
      </div>
    </div>
  );
}
