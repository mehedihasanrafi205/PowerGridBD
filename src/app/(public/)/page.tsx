import Link from "next/link";

export default function PublicPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              PowerGridBD v1.0 - Production Ready
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Load Shedding & Power Outage{" "}
              <span className="text-primary">Management Platform</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              A comprehensive platform for reporting outages, managing
              load-shedding schedules, tracking restoration, and overseeing grid
              infrastructure across Bangladesh.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/login"
                className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/auth/register"
                className="w-full sm:w-auto border border-border bg-background px-8 py-3 rounded-lg text-lg font-semibold hover:bg-muted transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Built for Every Role
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Role-based dashboards tailored for customers, technicians,
              operators, and administrators
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Customer Card */}
            <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Customer portal icon"
                  role="img"
                >
                  <title>Customer Portal</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Customer Portal
              </h3>
              <p className="text-muted-foreground mb-4">
                Report outages, track restoration, manage SLA subscriptions,
                view payment history
              </p>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-primary hover:underline"
              >
                Access Dashboard →
              </Link>
            </div>

            {/* Technician Card */}
            <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-emerald/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-emerald"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Technician dashboard icon"
                  role="img"
                >
                  <title>Technician Dashboard</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Technician Dashboard
              </h3>
              <p className="text-muted-foreground mb-4">
                View assigned tasks, start work, resolve outages, track
                performance metrics
              </p>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-emerald hover:underline"
              >
                Access Dashboard →
              </Link>
            </div>

            {/* Operator Card */}
            <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-amber/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-amber"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Power operator dashboard icon"
                  role="img"
                >
                  <title>Power Operator</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Power Operator
              </h3>
              <p className="text-muted-foreground mb-4">
                Manage grid hierarchy, assign technicians, create schedules,
                view analytics
              </p>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-amber hover:underline"
              >
                Access Dashboard →
              </Link>
            </div>

            {/* Admin Card */}
            <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Admin console icon"
                  role="img"
                >
                  <title>Admin Console</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Admin Console
              </h3>
              <p className="text-muted-foreground mb-4">
                User management, financial analytics, audit logs, system
                oversight
              </p>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-destructive hover:underline"
              >
                Access Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                100%+
              </div>
              <div className="text-muted-foreground">Uptime Target</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-emerald mb-2">
                {"< 2hr"}
              </div>
              <div className="text-muted-foreground">Avg Resolution</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-amber mb-2">
                24/7
              </div>
              <div className="text-muted-foreground">Grid Monitoring</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                SSLCommerz
              </div>
              <div className="text-muted-foreground">Secure Payments</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Manage Power Infrastructure?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join utilities across Bangladesh using PowerGridBD for reliable
            outage management and load-shedding coordination.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-foreground/90 transition-colors"
          >
            Start Free Trial
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Arrow right"
              role="img"
            >
              <title>Arrow Right</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
