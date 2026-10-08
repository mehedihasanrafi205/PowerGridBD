"use client";

import {
  ChevronDown,
  ChevronRight,
  CirclePlus,
  GitBranch,
  Globe,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateArea,
  useCreateFeeder,
  useCreateSubstation,
  useCreateZone,
  useDeleteArea,
  useDeleteFeeder,
  useDeleteSubstation,
  useDeleteZone,
  useUpdateArea,
  useUpdateFeeder,
  useUpdateSubstation,
  useUpdateZone,
} from "@/hooks";
import { cn } from "@/lib/utils";
import type { Area, Feeder, Substation, Zone } from "@/types";
import { EmptyState } from "./EmptyState";
import { GridHealthIndicator } from "./GridHealthIndicator";
import { PowerFlowIndicator } from "./PowerFlowIndicator";
import { TechnicalDataPanel } from "./TechnicalDataPanel";

export type GridLevel = "zone" | "substation" | "feeder" | "area";

interface GridSelection {
  level: GridLevel;
  id: string;
}

interface GridHierarchyExplorerProps {
  zones?: Zone[];
  substations?: Substation[];
  feeders?: Feeder[];
  areas?: Area[];
  loading?: boolean;
}

const LEVEL_META: Record<
  GridLevel,
  { label: string; plural: string; icon: typeof Globe }
> = {
  zone: { label: "Zone", plural: "Zones", icon: Globe },
  substation: { label: "Substation", plural: "Substations", icon: Zap },
  feeder: { label: "Feeder", plural: "Feeders", icon: GitBranch },
  area: { label: "Area", plural: "Areas", icon: MapPin },
};

/** Child level for the "add child" action (areas are leaves). */
const CHILD_LEVEL: Partial<Record<GridLevel, GridLevel>> = {
  zone: "substation",
  substation: "feeder",
  feeder: "area",
};

function nodeKey(level: GridLevel, id: string) {
  return `${level}:${id}`;
}

function matches(query: string, ...fields: Array<string | undefined>) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => field?.toLowerCase().includes(q));
}

/**
 * GridHierarchyExplorer — nested Zone → Substation → Feeder →
 * Area tree with a node detail panel and full CRUD (Design.md §7).
 *
 * The tree is derived from the real flat lists via parent IDs;
 * search filters across name/code at every level; create, rename
 * (+ reparent), and delete run through the real grid mutations.
 * Shared by the operator and admin grid pages.
 */
export function GridHierarchyExplorer({
  zones = [],
  substations = [],
  feeders = [],
  areas = [],
  loading = false,
}: GridHierarchyExplorerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<GridSelection | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialog, setDialog] = useState<
    | { mode: "create"; level: GridLevel; parentId?: string }
    | { mode: "edit"; level: GridLevel; id: string }
    | null
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    level: GridLevel;
    id: string;
    name: string;
    childCount: number;
  } | null>(null);

  // ---- mutations (one hook set per level) ----
  const createZone = useCreateZone();
  const updateZone = useUpdateZone();
  const deleteZone = useDeleteZone();
  const createSubstation = useCreateSubstation();
  const updateSubstation = useUpdateSubstation();
  const deleteSubstation = useDeleteSubstation();
  const createFeeder = useCreateFeeder();
  const updateFeeder = useUpdateFeeder();
  const deleteFeeder = useDeleteFeeder();
  const createArea = useCreateArea();
  const updateArea = useUpdateArea();
  const deleteArea = useDeleteArea();
  const mutating =
    createZone.isPending ||
    updateZone.isPending ||
    deleteZone.isPending ||
    createSubstation.isPending ||
    updateSubstation.isPending ||
    deleteSubstation.isPending ||
    createFeeder.isPending ||
    updateFeeder.isPending ||
    deleteFeeder.isPending ||
    createArea.isPending ||
    updateArea.isPending ||
    deleteArea.isPending;

  // ---- derived hierarchy ----
  const substationsOf = (zoneId: string) =>
    substations.filter((s) => s.zoneId === zoneId);
  const feedersOf = (substationId: string) =>
    feeders.filter((f) => f.substationId === substationId);
  const areasOf = (feederId: string) =>
    areas.filter((a) => a.feederId === feederId);

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const select = (level: GridLevel, id: string) => {
    setSelected({ level, id });
    setExpanded((prev) => new Set(prev).add(nodeKey(level, id)));
  };

  // Search: match + ancestors stay visible, everything expands.
  const searching = searchTerm.trim().length > 0;
  const visibleZones = zones.filter((z) => {
    if (!searching) return true;
    if (matches(searchTerm, z.name, z.code)) return true;
    return substationsOf(z.id).some(
      (s) =>
        matches(searchTerm, s.name, s.code) ||
        feedersOf(s.id).some(
          (f) =>
            matches(searchTerm, f.name, f.code) ||
            areasOf(f.id).some((a) => matches(searchTerm, a.name, a.code)),
        ),
    );
  });

  const selectedNode = (() => {
    if (!selected) return null;
    if (selected.level === "zone") {
      const node = zones.find((z) => z.id === selected.id);
      return node ? { level: selected.level, node } : null;
    }
    if (selected.level === "substation") {
      const node = substations.find((s) => s.id === selected.id);
      return node ? { level: selected.level, node } : null;
    }
    if (selected.level === "feeder") {
      const node = feeders.find((f) => f.id === selected.id);
      return node ? { level: selected.level, node } : null;
    }
    const node = areas.find((a) => a.id === selected.id);
    return node ? { level: selected.level, node } : null;
  })();

  const childCountOf = (level: GridLevel, id: string): number => {
    if (level === "zone") return substationsOf(id).length;
    if (level === "substation") return feedersOf(id).length;
    if (level === "feeder") return areasOf(id).length;
    return 0;
  };

  // Every tracked node, for the honest energized-share metric.
  const allNodes = [
    ...zones.map((z) => ({ active: z.isActive === true })),
    ...substations.map((s) => ({ active: s.isActive === true })),
    ...feeders.map((f) => ({ active: f.isActive === true })),
    ...areas.map((a) => ({ active: a.isActive === true })),
  ];

  const runDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.level === "zone")
        await deleteZone.mutateAsync(deleteTarget.id);
      else if (deleteTarget.level === "substation")
        await deleteSubstation.mutateAsync(deleteTarget.id);
      else if (deleteTarget.level === "feeder")
        await deleteFeeder.mutateAsync(deleteTarget.id);
      else await deleteArea.mutateAsync(deleteTarget.id);
      if (
        selected?.level === deleteTarget.level &&
        selected.id === deleteTarget.id
      ) {
        setSelected(null);
      }
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete node",
      );
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Grid health strip — real energized share across all levels */}
      <Card className="lg:col-span-5">
        <CardContent className="pt-6">
          <GridHealthIndicator
            label="Grid nodes energized"
            active={allNodes.filter((n) => n.active).length}
            total={allNodes.length}
          />
        </CardContent>
      </Card>

      {/* Tree panel */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Grid Node Hierarchy</CardTitle>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={mutating}
              onClick={() => setDialog({ mode: "create", level: "zone" })}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Zone
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-3">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              aria-label="Filter grid hierarchy"
              placeholder="Filter by name or code…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="space-y-2">
              <span className="sr-only">Loading hierarchy</span>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className="h-10 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : visibleZones.length === 0 ? (
            <EmptyState
              icon={<Globe className="h-5 w-5" />}
              title={searching ? "No nodes match your filter" : "No zones yet"}
              description={
                searching
                  ? "Try a different name or code."
                  : "Create the first zone to start building the hierarchy."
              }
              action={
                !searching ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setDialog({ mode: "create", level: "zone" })}
                  >
                    <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                    Add Zone
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <ul className="max-h-[560px] space-y-1 overflow-y-auto pr-1">
              {visibleZones.map((zone) => (
                <TreeZone
                  key={zone.id}
                  zone={zone}
                  substations={substationsOf(zone.id)}
                  feedersOf={feedersOf}
                  areasOf={areasOf}
                  searchTerm={searching ? searchTerm : ""}
                  expanded={expanded}
                  searching={searching}
                  selected={selected}
                  onToggle={toggle}
                  onSelect={select}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Detail panel */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Node Details</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedNode ? (
            <EmptyState
              icon={<GitBranch className="h-5 w-5" />}
              title="No node selected"
              description="Select a zone, substation, feeder, or area in the tree to inspect and manage it."
            />
          ) : (
            <NodeDetail
              level={selectedNode.level}
              node={selectedNode.node}
              zones={zones}
              substations={substations}
              feeders={feeders}
              areas={areas}
              mutating={mutating}
              onAddChild={(level, parentId) =>
                setDialog({ mode: "create", level, parentId })
              }
              onEdit={(level, id) => setDialog({ mode: "edit", level, id })}
              onDelete={(level, id, name) =>
                setDeleteTarget({
                  level,
                  id,
                  name,
                  childCount: childCountOf(level, id),
                })
              }
              onSelect={select}
            />
          )}
        </CardContent>
      </Card>

      {/* Create / edit dialog */}
      <GridNodeDialog
        dialog={dialog}
        zones={zones}
        substations={substations}
        feeders={feeders}
        mutating={mutating}
        onClose={() => setDialog(null)}
        onSubmit={async (values) => {
          try {
            if (!dialog) return;
            if (dialog.mode === "create") {
              if (dialog.level === "zone") {
                await createZone.mutateAsync({
                  name: values.name,
                  code: values.code || undefined,
                });
              } else if (dialog.level === "substation" && values.parentId) {
                await createSubstation.mutateAsync({
                  name: values.name,
                  code: values.code || undefined,
                  zoneId: values.parentId,
                });
              } else if (dialog.level === "feeder" && values.parentId) {
                await createFeeder.mutateAsync({
                  name: values.name,
                  code: values.code || undefined,
                  substationId: values.parentId,
                });
              } else if (dialog.level === "area" && values.parentId) {
                await createArea.mutateAsync({
                  name: values.name,
                  code: values.code || undefined,
                  feederId: values.parentId,
                });
              }
            } else {
              // Edit narrows to rename (+ reparent below zone level).
              const payload = { name: values.name };
              if (dialog.level === "zone") {
                await updateZone.mutateAsync({
                  id: dialog.id,
                  payload,
                });
              } else if (dialog.level === "substation" && values.parentId) {
                await updateSubstation.mutateAsync({
                  id: dialog.id,
                  payload: { ...payload, zoneId: values.parentId },
                });
              } else if (dialog.level === "feeder" && values.parentId) {
                await updateFeeder.mutateAsync({
                  id: dialog.id,
                  payload: { ...payload, substationId: values.parentId },
                });
              } else if (dialog.level === "area" && values.parentId) {
                await updateArea.mutateAsync({
                  id: dialog.id,
                  payload: { ...payload, feederId: values.parentId },
                });
              }
            }
            setDialog(null);
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Failed to save node",
            );
          }
        }}
      />

      {/* Delete confirmation */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete {deleteTarget ? LEVEL_META[deleteTarget.level].label : ""}?
            </DialogTitle>
            <DialogDescription>
              This permanently removes “{deleteTarget?.name}”.
              {deleteTarget && deleteTarget.childCount > 0
                ? ` It still contains ${deleteTarget.childCount} child node(s) — the backend may reject the deletion until they are moved or removed.`
                : " This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={mutating}
              onClick={runDelete}
            >
              {mutating ? "Deleting…" : "Delete node"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- Tree rows ---------------- */

interface TreeCommonProps {
  searchTerm: string;
  expanded: Set<string>;
  searching: boolean;
  selected: GridSelection | null;
  onToggle: (key: string) => void;
  onSelect: (level: GridLevel, id: string) => void;
}

function StatusDot({ active }: { active?: boolean }) {
  return (
    <span
      className={cn(
        "h-2 w-2 shrink-0 rounded-full",
        active ? "bg-emerald" : "bg-muted-foreground",
      )}
      aria-hidden="true"
    />
  );
}

function TreeRow({
  level,
  id,
  name,
  code,
  active,
  count,
  countLabel,
  depth,
  hasChildren,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
}: {
  level: GridLevel;
  id: string;
  name: string;
  code?: string;
  active?: boolean;
  count?: number;
  countLabel?: string;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: (key: string) => void;
  onSelect: (level: GridLevel, id: string) => void;
}) {
  const Icon = LEVEL_META[level].icon;
  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/60",
          isSelected && "bg-primary/10",
        )}
        style={{ paddingLeft: `${0.5 + depth * 1.1}rem` }}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={isExpanded ? `Collapse ${name}` : `Expand ${name}`}
            aria-expanded={isExpanded}
            onClick={() => onToggle(nodeKey(level, id))}
            className="rounded p-0.5 text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        ) : (
          <span className="w-[18px]" aria-hidden="true" />
        )}
        <button
          type="button"
          onClick={() => onSelect(level, id)}
          aria-current={isSelected ? "true" : undefined}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <Icon
            className={cn(
              "h-3.5 w-3.5 shrink-0",
              isSelected ? "text-primary" : "text-muted-foreground",
            )}
            aria-hidden="true"
          />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-foreground">
              {name}
            </span>
            <span className="block truncate font-mono text-[11px] text-muted-foreground">
              {code || LEVEL_META[level].label}
              {typeof count === "number" &&
                countLabel &&
                ` • ${count} ${countLabel}`}
            </span>
          </span>
        </button>
        <StatusDot active={active} />
      </div>
    </li>
  );
}

function TreeZone({
  zone,
  substations,
  feedersOf,
  areasOf,
  ...common
}: {
  zone: Zone;
  substations: Substation[];
  feedersOf: (id: string) => Feeder[];
  areasOf: (id: string) => Area[];
} & TreeCommonProps) {
  const key = nodeKey("zone", zone.id);
  const isExpanded = common.searching || common.expanded.has(key);
  const isSelected =
    common.selected?.level === "zone" && common.selected.id === zone.id;
  return (
    <>
      <TreeRow
        level="zone"
        id={zone.id}
        name={zone.name}
        code={zone.code}
        active={zone.isActive}
        count={substations.length}
        countLabel="substations"
        depth={0}
        hasChildren={substations.length > 0}
        isExpanded={isExpanded}
        isSelected={isSelected}
        onToggle={common.onToggle}
        onSelect={common.onSelect}
      />
      {isExpanded && substations.length > 0 && (
        <ul>
          {substations.map((sub) => {
            const feeders = feedersOf(sub.id);
            const subKey = nodeKey("substation", sub.id);
            const subExpanded = common.searching || common.expanded.has(subKey);
            return (
              <div key={sub.id}>
                <TreeRow
                  level="substation"
                  id={sub.id}
                  name={sub.name}
                  code={sub.code}
                  active={sub.isActive}
                  count={feeders.length}
                  countLabel="feeders"
                  depth={1}
                  hasChildren={feeders.length > 0}
                  isExpanded={subExpanded}
                  isSelected={
                    common.selected?.level === "substation" &&
                    common.selected.id === sub.id
                  }
                  onToggle={common.onToggle}
                  onSelect={common.onSelect}
                />
                {subExpanded &&
                  feeders.map((feeder) => {
                    const areas = areasOf(feeder.id);
                    const feederKey = nodeKey("feeder", feeder.id);
                    const feederExpanded =
                      common.searching || common.expanded.has(feederKey);
                    return (
                      <div key={feeder.id}>
                        <TreeRow
                          level="feeder"
                          id={feeder.id}
                          name={feeder.name}
                          code={feeder.code}
                          active={feeder.isActive}
                          count={areas.length}
                          countLabel="areas"
                          depth={2}
                          hasChildren={areas.length > 0}
                          isExpanded={feederExpanded}
                          isSelected={
                            common.selected?.level === "feeder" &&
                            common.selected.id === feeder.id
                          }
                          onToggle={common.onToggle}
                          onSelect={common.onSelect}
                        />
                        {feederExpanded &&
                          areas.map((area) => (
                            <TreeRow
                              key={area.id}
                              level="area"
                              id={area.id}
                              name={area.name}
                              code={area.code}
                              active={area.isActive}
                              count={area._count?.customers}
                              countLabel="customers"
                              depth={3}
                              hasChildren={false}
                              isExpanded={false}
                              isSelected={
                                common.selected?.level === "area" &&
                                common.selected.id === area.id
                              }
                              onToggle={common.onToggle}
                              onSelect={common.onSelect}
                            />
                          ))}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </ul>
      )}
    </>
  );
}

/* ---------------- Detail panel ---------------- */

function NodeDetail({
  level,
  node,
  zones,
  substations,
  feeders,
  areas,
  mutating,
  onAddChild,
  onEdit,
  onDelete,
  onSelect,
}: {
  level: GridLevel;
  node: Zone | Substation | Feeder | Area;
  zones: Zone[];
  substations: Substation[];
  feeders: Feeder[];
  areas: Area[];
  mutating: boolean;
  onAddChild: (level: GridLevel, parentId: string) => void;
  onEdit: (level: GridLevel, id: string) => void;
  onDelete: (level: GridLevel, id: string, name: string) => void;
  onSelect: (level: GridLevel, id: string) => void;
}) {
  const meta = LEVEL_META[level];
  const childLevel = CHILD_LEVEL[level];

  const parentChain: Array<{ level: GridLevel; id: string; name: string }> = [];
  let children: Array<{
    level: GridLevel;
    id: string;
    name: string;
    code?: string;
    active?: boolean;
  }> = [];

  if (level === "substation") {
    const zone = zones.find((z) => z.id === (node as Substation).zoneId);
    if (zone) parentChain.push({ level: "zone", id: zone.id, name: zone.name });
    children = feeders
      .filter((f) => f.substationId === node.id)
      .map((f) => ({
        level: "feeder" as GridLevel,
        id: f.id,
        name: f.name,
        code: f.code,
        active: f.isActive,
      }));
  } else if (level === "feeder") {
    const sub = substations.find((s) => s.id === (node as Feeder).substationId);
    if (sub) {
      const zone = zones.find((z) => z.id === sub.zoneId);
      if (zone)
        parentChain.push({ level: "zone", id: zone.id, name: zone.name });
      parentChain.push({
        level: "substation",
        id: sub.id,
        name: sub.name,
      });
    }
    children = areas
      .filter((a) => a.feederId === node.id)
      .map((a) => ({
        level: "area" as GridLevel,
        id: a.id,
        name: a.name,
        code: a.code,
        active: a.isActive,
      }));
  } else if (level === "area") {
    const feeder = feeders.find((f) => f.id === (node as Area).feederId);
    if (feeder) {
      const sub = substations.find((s) => s.id === feeder.substationId);
      if (sub) {
        const zone = zones.find((z) => z.id === sub.zoneId);
        if (zone)
          parentChain.push({ level: "zone", id: zone.id, name: zone.name });
        parentChain.push({
          level: "substation",
          id: sub.id,
          name: sub.name,
        });
      }
      parentChain.push({
        level: "feeder",
        id: feeder.id,
        name: feeder.name,
      });
    }
  } else {
    children = substations
      .filter((s) => s.zoneId === node.id)
      .map((s) => ({
        level: "substation" as GridLevel,
        id: s.id,
        name: s.name,
        code: s.code,
        active: s.isActive,
      }));
  }

  return (
    <div className="space-y-5">
      {/* Identity */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {meta.label}
          </p>
          <h3 className="text-xl font-bold text-foreground">{node.name}</h3>
          <p className="font-mono text-sm text-muted-foreground">
            {node.code || "—"}
          </p>
        </div>
        <Badge variant={node.isActive ? "success" : "secondary"}>
          {node.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Energized path visual */}
      <PowerFlowIndicator
        from={parentChain.length > 0 ? parentChain[0].name : "National grid"}
        to={node.name}
        active={node.isActive}
      />

      {/* Parent chain */}
      {parentChain.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Location in hierarchy
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            {parentChain.map((p, i) => (
              <span key={p.id} className="inline-flex items-center gap-1.5">
                {i > 0 && (
                  <span className="text-muted-foreground" aria-hidden="true">
                    →
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onSelect(p.level, p.id)}
                  className="text-primary hover:underline"
                >
                  {p.name}
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Specs */}
      <TechnicalDataPanel
        rows={[
          { label: "Node ID", value: `#${node.id.slice(0, 8)}`, mono: true },
          {
            label: "Created",
            value: new Date(node.createdAt).toLocaleDateString(),
            mono: true,
          },
          {
            label: "Updated",
            value: new Date(node.updatedAt).toLocaleDateString(),
            mono: true,
          },
        ]}
      />

      {/* Children */}
      {childLevel && (
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {LEVEL_META[childLevel].plural} ({children.length})
          </p>
          {children.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No {LEVEL_META[childLevel].plural.toLowerCase()} yet.
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border">
              {children.map((child) => (
                <li key={child.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(child.level, child.id)}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/60"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <StatusDot active={child.active} />
                      <span className="truncate font-medium">{child.name}</span>
                      {child.code && (
                        <span className="truncate font-mono text-xs text-muted-foreground">
                          {child.code}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-primary" aria-hidden="true">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 border-t pt-4">
        {childLevel && (
          <Button
            type="button"
            size="sm"
            disabled={mutating}
            onClick={() => onAddChild(childLevel, node.id)}
          >
            <CirclePlus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add {LEVEL_META[childLevel].label}
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={mutating}
          onClick={() => onEdit(level, node.id)}
        >
          <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
          Rename
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={mutating}
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(level, node.id, node.name)}
        >
          <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
          Delete
        </Button>
      </div>
    </div>
  );
}

/* ---------------- Create / edit dialog ---------------- */

interface DialogState {
  mode: "create" | "edit";
  level: GridLevel;
  parentId?: string;
  id?: string;
}

function GridNodeDialog({
  dialog,
  zones,
  substations,
  feeders,
  mutating,
  onClose,
  onSubmit,
}: {
  dialog: DialogState | null;
  zones: Zone[];
  substations: Substation[];
  feeders: Feeder[];
  mutating: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; code: string; parentId?: string }) => void;
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");

  // Reset the form whenever a different dialog opens.
  const dialogKey = dialog
    ? `${dialog.mode}-${dialog.level}-${dialog.parentId ?? ""}`
    : "closed";
  const [lastKey, setLastKey] = useState(dialogKey);
  if (lastKey !== dialogKey) {
    setLastKey(dialogKey);
    setName("");
    setCode("");
    setParentId(dialog?.parentId);
    setError("");
  }

  if (!dialog) return null;
  const meta = LEVEL_META[dialog.level];

  const parentOptions =
    dialog.level === "substation"
      ? zones.map((z) => ({ id: z.id, name: z.name }))
      : dialog.level === "feeder"
        ? substations.map((s) => ({ id: s.id, name: s.name }))
        : dialog.level === "area"
          ? feeders.map((f) => ({ id: f.id, name: f.name }))
          : [];
  const parentLabel =
    dialog.level === "substation"
      ? "Zone"
      : dialog.level === "feeder"
        ? "Substation"
        : dialog.level === "area"
          ? "Feeder"
          : "";

  const save = () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (dialog.level !== "zone" && !parentId) {
      setError(`Please choose a parent ${parentLabel.toLowerCase()}.`);
      return;
    }
    onSubmit({ name: name.trim(), code: code.trim(), parentId });
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dialog.mode === "create" ? "Add" : "Rename"} {meta.label}
          </DialogTitle>
          <DialogDescription>
            {dialog.mode === "create"
              ? `Create a new ${meta.label.toLowerCase()} in the hierarchy.`
              : `Update this ${meta.label.toLowerCase()}. Codes cannot be changed after creation.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grid-node-name">Name</Label>
            <Input
              id="grid-node-name"
              placeholder={`e.g. Dhaka North ${meta.label}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={mutating}
            />
          </div>

          {dialog.mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="grid-node-code">
                Code{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="grid-node-code"
                placeholder="e.g. Z-01"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={mutating}
                className="font-mono"
              />
            </div>
          )}

          {dialog.level !== "zone" && (
            <div className="space-y-2">
              <Label htmlFor="grid-node-parent">Parent {parentLabel}</Label>
              <Select
                value={parentId}
                onValueChange={setParentId}
                disabled={mutating}
              >
                <SelectTrigger id="grid-node-parent">
                  <SelectValue
                    placeholder={`Select a ${parentLabel.toLowerCase()}…`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {parentOptions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" disabled={mutating} onClick={save}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            {mutating
              ? "Saving…"
              : dialog.mode === "create"
                ? `Add ${meta.label}`
                : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
