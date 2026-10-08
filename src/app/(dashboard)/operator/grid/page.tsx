"use client";

import { GitBranch, Globe, Loader2, MapPin, Search, Zap } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard";
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
import {
  useAreas,
  useAuth,
  useFeeders,
  useSubstations,
  useZones,
} from "@/hooks";

function matches(query: string, ...fields: Array<string | undefined>) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => field?.toLowerCase().includes(q));
}

export default function OperatorGridPage() {
  const { isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("zones");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: zones, isLoading: zonesLoading } = useZones();
  const { data: substations, isLoading: substationsLoading } = useSubstations();
  const { data: feeders, isLoading: feedersLoading } = useFeeders();
  const { data: areas, isLoading: areasLoading } = useAreas();

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 rounded bg-muted" />
          <div className="h-64 rounded bg-muted" />
        </div>
      </div>
    );
  }

  const filteredZones = (zones?.data || []).filter((zone) =>
    matches(searchTerm, zone.name, zone.code),
  );
  const filteredSubstations = (substations?.data || []).filter((sub) =>
    matches(searchTerm, sub.name, sub.code, sub.zone?.name),
  );
  const filteredFeeders = (feeders?.data || []).filter((feeder) =>
    matches(
      searchTerm,
      feeder.name,
      feeder.code,
      feeder.substation?.name,
      feeder.substation?.zone?.name,
    ),
  );
  const filteredAreas = (areas?.data || []).filter((area) =>
    matches(searchTerm, area.name, area.code, area.feeder?.name),
  );

  const renderZonesTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead className="text-right tabular-nums">Substations</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {zonesLoading ? (
          <TableRow>
            <TableCell colSpan={4} className="py-8 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
            </TableCell>
          </TableRow>
        ) : filteredZones.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="py-8 text-center text-muted-foreground"
            >
              {searchTerm ? "No zones match your search" : "No zones found"}
            </TableCell>
          </TableRow>
        ) : (
          filteredZones.map((zone) => (
            <TableRow key={zone.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{zone.name}</TableCell>
              <TableCell className="font-mono text-sm">{zone.code}</TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {zone._count?.substations || 0}
              </TableCell>
              <TableCell>
                <Badge variant={zone.isActive ? "success" : "secondary"}>
                  {zone.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  const renderSubstationsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Zone</TableHead>
          <TableHead className="text-right tabular-nums">Feeders</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {substationsLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="py-8 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
            </TableCell>
          </TableRow>
        ) : filteredSubstations.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="py-8 text-center text-muted-foreground"
            >
              {searchTerm
                ? "No substations match your search"
                : "No substations found"}
            </TableCell>
          </TableRow>
        ) : (
          filteredSubstations.map((sub) => (
            <TableRow key={sub.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{sub.name}</TableCell>
              <TableCell className="font-mono text-sm">{sub.code}</TableCell>
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
  );

  const renderFeedersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Substation</TableHead>
          <TableHead>Zone</TableHead>
          <TableHead className="text-right tabular-nums">Areas</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feedersLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="py-8 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
            </TableCell>
          </TableRow>
        ) : filteredFeeders.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="py-8 text-center text-muted-foreground"
            >
              {searchTerm ? "No feeders match your search" : "No feeders found"}
            </TableCell>
          </TableRow>
        ) : (
          filteredFeeders.map((feeder) => (
            <TableRow key={feeder.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{feeder.name}</TableCell>
              <TableCell className="font-mono text-sm">{feeder.code}</TableCell>
              <TableCell>{feeder.substation?.name || "N/A"}</TableCell>
              <TableCell>{feeder.substation?.zone?.name || "N/A"}</TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {feeder._count?.areas || 0}
              </TableCell>
              <TableCell>
                <Badge variant={feeder.isActive ? "success" : "secondary"}>
                  {feeder.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  const renderAreasTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Feeder</TableHead>
          <TableHead className="text-right tabular-nums">Customers</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {areasLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="py-8 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
            </TableCell>
          </TableRow>
        ) : filteredAreas.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="py-8 text-center text-muted-foreground"
            >
              {searchTerm ? "No areas match your search" : "No areas found"}
            </TableCell>
          </TableRow>
        ) : (
          filteredAreas.map((area) => (
            <TableRow key={area.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{area.name}</TableCell>
              <TableCell className="font-mono text-sm">{area.code}</TableCell>
              <TableCell>{area.feeder?.name || "N/A"}</TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {area._count?.customers || 0}
              </TableCell>
              <TableCell>
                <Badge variant={area.isActive ? "success" : "secondary"}>
                  {area.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Grid Management"
        description="Grid hierarchy: Zones → Substations → Feeders → Areas"
        status={
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="h-4 w-4 text-primary" aria-hidden="true" />
            Read-only operational view
          </span>
        }
      />

      <Card>
        <CardHeader>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="zones">
                <Globe className="mr-2 h-4 w-4" />
                Zones
              </TabsTrigger>
              <TabsTrigger value="substations">
                <Zap className="mr-2 h-4 w-4" />
                Substations
              </TabsTrigger>
              <TabsTrigger value="feeders">
                <GitBranch className="mr-2 h-4 w-4" />
                Feeders
              </TabsTrigger>
              <TabsTrigger value="areas">
                <MapPin className="mr-2 h-4 w-4" />
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
            {activeTab === "zones" && renderZonesTable()}
            {activeTab === "substations" && renderSubstationsTable()}
            {activeTab === "feeders" && renderFeedersTable()}
            {activeTab === "areas" && renderAreasTable()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
