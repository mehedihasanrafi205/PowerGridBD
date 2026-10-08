import type { GridMapData } from "./map-types";

/**
 * Deterministic demonstration topology.
 *
 * Positions are real Bangladeshi city coordinates (public
 * geographic knowledge) so the network reads as Bangladesh.
 * Node STATUSES are illustrative only — clearly badged as
 * demonstration in the UI — because the backend exposes no
 * per-node coordinates or live statuses today.
 *
 * No randomness, no animation of positions: the layer is
 * stable across renders. Replace wholesale with API data
 * (same `GridMapData` shape) when the backend supports it.
 */
export const DEMO_TOPOLOGY: GridMapData = {
  provenance: "demo",
  nodes: [
    {
      id: "dhaka-hub",
      name: "Dhaka Central Hub",
      kind: "hub",
      lat: 23.8103,
      lng: 90.4125,
      status: "hub",
      detail: "National dispatch coordination point",
    },
    {
      id: "chattogram",
      name: "Chattogram Ring",
      kind: "substation",
      lat: 22.3569,
      lng: 91.7832,
      status: "energized",
      detail: "Industrial ring monitoring",
    },
    {
      id: "sylhet",
      name: "Sylhet Estate Ring",
      kind: "substation",
      lat: 24.8949,
      lng: 91.869,
      status: "energized",
      detail: "Northeast corridor",
    },
    {
      id: "khulna",
      name: "Khulna Corridor",
      kind: "substation",
      lat: 22.8456,
      lng: 89.5403,
      status: "warning",
      detail: "Scheduled maintenance window",
    },
    {
      id: "rajshahi",
      name: "Rajshahi Feed",
      kind: "substation",
      lat: 24.3745,
      lng: 88.6042,
      status: "energized",
      detail: "Western intertie",
    },
    {
      id: "rangpur",
      name: "Rangpur Spur",
      kind: "substation",
      lat: 25.7439,
      lng: 89.2752,
      status: "energized",
      detail: "Northern spur line",
    },
    {
      id: "barishal",
      name: "Barishal Delta",
      kind: "substation",
      lat: 22.701,
      lng: 90.3535,
      status: "energized",
      detail: "Delta distribution",
    },
    {
      id: "cumilla",
      name: "Cumilla Trunk",
      kind: "feeder",
      lat: 23.4607,
      lng: 91.1809,
      status: "outage",
      detail: "Fault crew dispatched (illustrative)",
    },
  ],
  links: [
    { from: "dhaka-hub", to: "chattogram" },
    { from: "dhaka-hub", to: "sylhet" },
    { from: "dhaka-hub", to: "khulna" },
    { from: "dhaka-hub", to: "rajshahi" },
    { from: "dhaka-hub", to: "rangpur" },
    { from: "dhaka-hub", to: "barishal" },
    { from: "dhaka-hub", to: "cumilla" },
  ],
};
