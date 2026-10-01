"use client";

import { useAuth } from "@/hooks";
import { useZones, useSubstations, useFeeders, useAreas } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, GitBranch, Zap, MapPin, Loader2, Search, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function AdminGridPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("zones");

  const { data: zones, isLoading: zonesLoading } = useZones();
  const { data: substations, isLoading: substationsLoading } = useSubstations();
  const { data: feeders, isLoading: feedersLoading } = useFeeders();
  const { data: areas, isLoading: areasLoading } = useAreas();

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const loading = zonesLoading || substationsLoading || feedersLoading || areasLoading;

  const renderZonesTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Substations</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {zonesLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            </TableCell>
          </TableRow>
        ) : !zones?.data || zones.data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No zones found</TableCell>
          </TableRow>
        ) : (
          zones.data.map((zone) => (
            <TableRow key={zone.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{zone.name}</TableCell>
              <TableCell className="font-mono text-sm">{zone.code}</TableCell>
              <TableCell>{zone._count?.substations || 0}</TableCell>
              <TableCell>
                <Badge variant={zone.isActive ? "success" : "secondary"}>
                  {zone.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
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
          <TableHead>Feeders</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {substationsLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            </TableCell>
          </TableRow>
        ) : !substations?.data || substations.data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No substations found</TableCell>
          </TableRow>
        ) : (
          substations.data.map((sub) => (
            <TableRow key={sub.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{sub.name}</TableCell>
              <TableCell className="font-mono text-sm">{sub.code}</TableCell>
              <TableCell>{sub.zone?.name || "N/A"}</TableCell>
              <TableCell>{sub._count?.feeders || 0}</TableCell>
              <TableCell>
                <Badge variant={sub.isActive ? "success" : "secondary"}>
                  {sub.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
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
          <TableHead>Areas</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feedersLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            </TableCell>
          </TableRow>
        ) : !feeders?.data || feeders.data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No feeders found</TableCell>
          </TableRow>
        ) : (
          feeders.data.map((feeder) => (
            <TableRow key={feeder.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{feeder.name}</TableCell>
              <TableCell className="font-mono text-sm">{feeder.code}</TableCell>
              <TableCell>{feeder.substation?.name || "N/A"}</TableCell>
              <TableCell>{feeder.substation?.zone?.name || "N/A"}</TableCell>
              <TableCell>{feeder._count?.areas || 0}</TableCell>
              <TableCell>
                <Badge variant={feeder.isActive ? "success" : "secondary"}>
                  {feeder.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
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
          <TableHead>Customers</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {areasLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            </TableCell>
          </TableRow>
        ) : !areas?.data || areas.data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No areas found</TableCell>
          </TableRow>
        ) : (
          areas.data.map((area) => (
            <TableRow key={area.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{area.name}</TableCell>
              <TableCell className="font-mono text-sm">{area.code}</TableCell>
              <TableCell>{area.feeder?.name || "N/A"}</TableCell>
              <TableCell>{area._count?.customers || 0}</TableCell>
              <TableCell>
                <Badge variant={area.isActive ? "success" : "secondary"}>
                  {area.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <GitBranch className="h-8 w-8 text-primary" />
            Grid Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage grid hierarchy: Zones → Substations → Feeders → Areas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <GitBranch className="h-4 w-4 mr-2" />
            Export Grid
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Zone
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="zones">
                <Zap className="h-4 w-4 mr-2" />
                Zones
              </TabsTrigger>
              <TabsTrigger value="substations">
                <Zap className="h-4 w-4 mr-2" />
                Substations
              </TabsTrigger>
              <TabsTrigger value="feeders">
                <Zap className="h-4 w-4 mr-2" />
                Feeders
              </TabsTrigger>
              <TabsTrigger value="areas">
                <MapPin className="h-4 w-4 mr-2" />
                Areas
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 w-full border rounded-lg py-2 px-4 bg-background"
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