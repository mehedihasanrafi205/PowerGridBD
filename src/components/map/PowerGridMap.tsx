"use client";

import L from "leaflet";
import { useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { cn } from "@/lib/utils";
import type { GridMapData, GridMapNode } from "./map-types";

interface PowerGridMapProps {
  data: GridMapData;
  className?: string;
}

const STATUS_LABEL: Record<GridMapNode["status"], string> = {
  hub: "Dispatch Hub",
  energized: "Energized",
  warning: "Maintenance",
  outage: "Fault",
  inactive: "Inactive",
};

const STATUS_DOT: Record<GridMapNode["status"], string> = {
  hub: "bg-electric-blue",
  energized: "bg-emerald",
  warning: "bg-amber",
  outage: "bg-destructive",
  inactive: "bg-slate-500",
};

function nodeIcon(node: GridMapNode, selected: boolean): L.DivIcon {
  const alert =
    node.status === "warning" || node.status === "outage"
      ? " pg-node-alert"
      : "";
  return L.divIcon({
    className: `pg-node pg-node-${node.status}${alert}${selected ? " pg-node-selected" : ""}`,
    html: `<span class="pg-node-dot"></span>`,
    iconSize: node.kind === "hub" ? [16, 16] : [12, 12],
    iconAnchor: node.kind === "hub" ? [8, 8] : [6, 6],
  });
}

/**
 * PowerGridMap — reusable Leaflet operations map.
 *
 * Dark CARTO tiles, DivIcon status markers, hub link lines,
 * legend + provenance overlays, and detail popups. Renders
 * purely from `GridMapData`, so API rows, demo topology, or
 * future live telemetry plug in without touching this file.
 * Wheel-zoom stays off so page scroll is never hijacked.
 */
export function PowerGridMap({ data, className }: PowerGridMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const byId = new Map(data.nodes.map((n) => [n.id, n]));

  // Build link position pairs keyed by a unique string
  const links: Array<{
    fromId: string;
    toId: string;
    positions: [number, number][];
  }> = data.links.flatMap((link) => {
    const a = byId.get(link.from);
    const b = byId.get(link.to);
    if (!a || !b) return [];
    return {
      fromId: link.from,
      toId: link.to,
      positions: [
        [a.lat, a.lng],
        [b.lat, b.lng],
      ],
    };
  });

  return (
    <div className={cn("pg-map relative h-full w-full", className)}>
      <MapContainer
        center={[23.7, 90.35]}
        zoom={7}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl
        className="h-full w-full"
        style={{ background: "var(--color-deep-charcoal)" }}
      >
        {/* Stadia Maps Alidade Smooth Dark — free tier, no API key required for development */}
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          maxZoom={20}
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <ZoomControl position="topright" />
        {links.map((link) => (
          <Polyline
            key={`${link.fromId}-${link.toId}`}
            positions={link.positions}
            pathOptions={{
              color: "#4d7dd1",
              weight: 1.5,
              opacity: 0.55,
              dashArray: "5 5",
            }}
          />
        ))}
        {data.nodes.map((node) => (
          <Marker
            key={node.id}
            position={[node.lat, node.lng]}
            icon={nodeIcon(node, selectedId === node.id)}
            eventHandlers={{ click: () => setSelectedId(node.id) }}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              opacity={1}
              className="pg-tip"
            >
              {node.name}
            </Tooltip>
            <Popup>
              <div className="min-w-[180px]">
                <p className="text-sm font-semibold text-white">{node.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs">
                  <span
                    className={cn(
                      "inline-block h-2 w-2 rounded-full",
                      STATUS_DOT[node.status],
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-zinc-300">
                    {STATUS_LABEL[node.status]} · {node.kind}
                  </span>
                </p>
                {node.detail && (
                  <p className="mt-1 text-xs text-zinc-400">{node.detail}</p>
                )}
                <p className="mt-1.5 font-mono text-[11px] tabular-nums text-zinc-500">
                  {node.lat.toFixed(4)}, {node.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Provenance badge */}
      {data.provenance === "demo" && (
        <div className="pointer-events-none absolute right-3 top-3 z-[500] rounded border border-white/15 bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-300 backdrop-blur-sm">
          Demonstration topology
        </div>
      )}

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-6 left-3 z-[500] rounded-lg border border-white/10 bg-black/60 px-2.5 py-2 backdrop-blur-sm">
        <ul className="space-y-1 font-mono text-[10px] uppercase tracking-wider text-zinc-300">
          <li className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-electric-blue" /> Hub
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald" /> Energized
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber" /> Maintenance
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-destructive" /> Fault
          </li>
        </ul>
      </div>
    </div>
  );
}
