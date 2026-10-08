"use client";

import { GitBranch, Globe, Loader2, MapPin, Search, Zap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Area, Feeder, Substation, Zone } from "@/types";

interface GridHierarchyExplorerProps {
  zones?: Zone[];
  substations?: Substation[];
  feeders?: Feeder[];
  areas?: Area[];
  loading?: boolean;
}

function matches(query: string, ...fields: Array<string | undefined>) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => field?.toLowerCase().includes(q));
}

function LoadingRow({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-8 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
      </TableCell>
    </TableRow>
  );
}

function EmptyRow({
  colSpan,
  query,
  noun,
}: {
  colSpan: number;
  query: string;
  noun: string;
}) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="py-8 text-center text-muted-foreground"
      >
        {query ? `No ${noun} match your search` : `No ${noun} found`}
      </TableCell>
    </TableRow>
  );
}

/**
 * GridHierarchyExplorer — the signature Zone → Substation →
 * Feeder → Area explorer (Design.md §7).
 *
 * Tabbed tables with a working client-side search across
 * name, code, and parent entities. Read-only operational
 * view shared by the operator and admin grid pages.
 */
export function GridHierarchyExplorer({
  zones = [],
  substations = [],
  feeders = [],
  areas = [],
  loading = false,
}: GridHierarchyExplorerProps) {
  const [activeTab, setActiveTab] = useState("zones");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredZones = zones.filter((zone) =>
    matches(searchTerm, zone.name, zone.code),
  );
  const filteredSubstations = substations.filter((sub) =>
    matches(searchTerm, sub.name, sub.code, sub.zone?.name),
  );
  const filteredFeeders = feeders.filter((feeder) =>
    matches(
      searchTerm,
      feeder.name,
      feeder.code,
      feeder.substation?.name,
      feeder.substation?.zone?.name,
    ),
  );
  const filteredAreas = areas.filter((area) =>
    matches(searchTerm, area.name, area.code, area.feeder?.name),
  );

  return (
    <Card>
      <CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="zones">
              <Globe className="mr-2 h-4 w-4" aria-hidden="true" />
              Zones
            </TabsTrigger>
            <TabsTrigger value="substations">
              <Zap className="mr-2 h-4 w-4" aria-hidden="true" />
              Substations
            </TabsTrigger>
            <TabsTrigger value="feeders">
              <GitBranch className="mr-2 h-4 w-4" aria-hidden="true" />
              Feeders
            </TabsTrigger>
            <TabsTrigger value="areas">
              <MapPin className="mr-2 h-4 w-4" aria-hidden="true" />
              Areas
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              aria-label="Search grid hierarchy"
              placeholder="Search name, code, or parent…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {activeTab === "zones" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-right tabular-nums">
                    Substations
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <LoadingRow colSpan={4} />
                ) : filteredZones.length === 0 ? (
                  <EmptyRow colSpan={4} query={searchTerm} noun="zones" />
                ) : (
                  filteredZones.map((zone) => (
                    <TableRow key={zone.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{zone.name}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {zone.code}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {zone._count?.substations || 0}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={zone.isActive ? "success" : "secondary"}
                        >
                          {zone.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {activeTab === "substations" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead className="text-right tabular-nums">
                    Feeders
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <LoadingRow colSpan={5} />
                ) : filteredSubstations.length === 0 ? (
                  <EmptyRow colSpan={5} query={searchTerm} noun="substations" />
                ) : (
                  filteredSubstations.map((sub) => (
                    <TableRow key={sub.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{sub.name}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {sub.code}
                      </TableCell>
                      <TableCell>{sub.zone?.name || "N/A"}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {sub._count?.feeders || 0}
                      </TableCell>
                      <TableCell>
                        <Badge variant={sub.isActive ? "success" : "secondary"}>
                          {sub.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {activeTab === "feeders" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Substation</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead className="text-right tabular-nums">
                    Areas
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <LoadingRow colSpan={6} />
                ) : filteredFeeders.length === 0 ? (
                  <EmptyRow colSpan={6} query={searchTerm} noun="feeders" />
                ) : (
                  filteredFeeders.map((feeder) => (
                    <TableRow key={feeder.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {feeder.name}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {feeder.code}
                      </TableCell>
                      <TableCell>{feeder.substation?.name || "N/A"}</TableCell>
                      <TableCell>
                        {feeder.substation?.zone?.name || "N/A"}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {feeder._count?.areas || 0}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={feeder.isActive ? "success" : "secondary"}
                        >
                          {feeder.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {activeTab === "areas" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Feeder</TableHead>
                  <TableHead className="text-right tabular-nums">
                    Customers
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <LoadingRow colSpan={5} />
                ) : filteredAreas.length === 0 ? (
                  <EmptyRow colSpan={5} query={searchTerm} noun="areas" />
                ) : (
                  filteredAreas.map((area) => (
                    <TableRow key={area.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{area.name}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {area.code}
                      </TableCell>
                      <TableCell>{area.feeder?.name || "N/A"}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {area._count?.customers || 0}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={area.isActive ? "success" : "secondary"}
                        >
                          {area.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
