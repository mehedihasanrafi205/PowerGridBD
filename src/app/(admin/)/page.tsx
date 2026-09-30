export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Console</h1>
        <p className="text-muted-foreground mt-2">
          Executive overview of platform metrics and system health.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">Total Users</div>
          <div className="text-3xl font-bold text-foreground mt-1">0</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">Active Outages</div>
          <div className="text-3xl font-bold text-destructive mt-1">0</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <div className="text-3xl font-bold text-emerald mt-1">BDT 0</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">SLA Subscriptions</div>
          <div className="text-3xl font-bold text-primary mt-1">0</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-card border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/users"
            className="p-4 bg-card border rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-foreground">User Management</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Manage users, roles, and status
            </p>
          </a>
          <a
            href="/admin/applications"
            className="p-4 bg-card border rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-foreground">
              Technician Applications
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Review and approve applications
            </p>
          </a>
          <a
            href="/admin/payments"
            className="p-4 bg-card border rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-foreground">
              Payment Management
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage all payments
            </p>
          </a>
          <a
            href="/admin/audit-logs"
            className="p-4 bg-card border rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-foreground">Audit Logs</h3>
            <p className="text-sm text-muted-foreground mt-1">
              System-wide audit trail
            </p>
          </a>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Role Distribution</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="text-3xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Customers</div>
          </div>
          <div className="bg-emerald/10 p-4 rounded-lg">
            <div className="text-3xl font-bold text-emerald">0</div>
            <div className="text-sm text-muted-foreground">Technicians</div>
          </div>
          <div className="bg-amber/10 p-4 rounded-lg">
            <div className="text-3xl font-bold text-amber">0</div>
            <div className="text-sm text-muted-foreground">Operators</div>
          </div>
          <div className="bg-destructive/10 p-4 rounded-lg">
            <div className="text-3xl font-bold text-destructive">0</div>
            <div className="text-sm text-muted-foreground">Admins</div>
          </div>
        </div>
      </div>
    </div>
  );
}
