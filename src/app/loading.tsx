/**
 * Route-transition fallback.
 *
 * Shown during client-side navigation while the next
 * segment streams in. Brand-consistent skeleton — fast,
 * static, and reduced-motion safe.
 */
export default function Loading() {
  return (
    <output className="container mx-auto block animate-pulse space-y-4 py-8">
      <span className="sr-only">Loading page…</span>
      <div className="h-8 w-1/4 rounded bg-muted" aria-hidden="true" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border bg-card p-6"
            aria-hidden="true"
          >
            <div className="mb-2 h-4 w-1/4 rounded bg-muted" />
            <div className="h-8 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="h-64 rounded bg-muted" aria-hidden="true" />
    </output>
  );
}
