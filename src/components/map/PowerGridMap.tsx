"use client";

import L from "leaflet";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
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

function MapSizeObserver() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize({ pan: false });
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [map]);

  return null;
}

export function PowerGridMap({ data, className }: PowerGridMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const byId = new Map(data.nodes.map((n) => [n.id, n]));

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
    <div
      className={cn(
        "pg-map relative isolate z-0 h-full w-full min-h-0 min-w-0 overflow-hidden",
        className,
      )}
    >
      <MapContainer
        center={[23.7, 90.35]}
        zoom={7}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl
        className="h-full w-full"
        style={{ background: "var(--color-deep-charcoal)" }}
      >
        <MapSizeObserver />
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          className="pg-dark-tiles"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {data.provenance === "demo" && (
          <div className="absolute right-4 top-4 z-20 rounded border border-white/15 bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-300 backdrop-blur-sm whitespace-nowrap">
            Demonstration topology
          </div>
        )}

        <div className="absolute bottom-4 left-4 z-20 rounded-lg border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-sm whitespace-nowrap">
          <ul className="space-y-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-electric-blue flex-shrink-0" />
              <span>Hub</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald flex-shrink-0" />
              <span>Energized</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber flex-shrink-0" />
              <span>Maintenance</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive flex-shrink-0" />
              <span>Fault</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
