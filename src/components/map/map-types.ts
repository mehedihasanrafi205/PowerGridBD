/**
 * Map data contracts (Design.md §7).
 *
 * The map UI never couples to one source: identical shapes can
 * arrive from the API, from deterministic demo data, or (later)
 * from live telemetry. `provenance` declares which one is on
 * screen so demo positions are never presented as live grid
 * measurements.
 */

export type GridNodeStatus =
  | "hub"
  | "energized"
  | "warning"
  | "outage"
  | "inactive";

export type GridNodeKind = "hub" | "substation" | "feeder";

export interface GridMapNode {
  id: string;
  name: string;
  kind: GridNodeKind;
  lat: number;
  lng: number;
  status: GridNodeStatus;
  detail?: string;
}

export interface GridMapLink {
  from: string;
  to: string;
}

export type MapProvenance = "demo" | "live";

export interface GridMapData {
  nodes: GridMapNode[];
  links: GridMapLink[];
  provenance: MapProvenance;
}
