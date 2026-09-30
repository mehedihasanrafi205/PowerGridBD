export default function OperatorDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Power Operator Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Operational overview of grid status, outages, and technician
          availability.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">Active Outages</div>
          <div className="text-3xl font-bold text-destructive mt-1">0</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">Priority Outages</div>
          <div className="text-3xl font-bold text-amber mt-1">0</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">
            Available Technicians
          </div>
          <div className="text-3xl font-bold text-emerald mt-1">0</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">Active Schedules</div>
          <div className="text-3xl font-bold text-primary mt-1">0</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="/operator/outages"
            className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground px-6 py-3 rounded-lg font-semibold hover:bg-destructive/90 transition-colors"
          >
            Manage Outages
          </a>
          <a
            href="/operator/schedules/create"
            className="inline-flex items-center gap-2 bg-amber text-amber-foreground px-6 py-3 rounded-lg font-semibold hover:bg-amber/90 transition-colors"
          >
            Create Schedule
          </a>
          <a
            href="/operator/grid"
            className="inline-flex items-center gap-2 border border-border bg-background px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
          >
            Manage Grid Hierarchy
          </a>
          <a
            href="/operator/applications"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Review Applications
          </a>
        </div>
      </div>

      {/* Operational Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Grid Health</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Critical Feeders</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Substations Online</span>
              <span className="font-semibold">0 / 0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Feeders Operational</span>
              <span className="font-semibold">0 / 0</span>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Outage Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pending Assignment</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">In Progress</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resolved Today</span>
              <span className="font-semibold">0</span>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">
            Technician Availability
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available</span>
              <span className="font-semibold text-emerald">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Busy</span>
              <span className="font-semibold text-amber">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Offline</span>
              <span className="font-semibold text-muted-foreground">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
