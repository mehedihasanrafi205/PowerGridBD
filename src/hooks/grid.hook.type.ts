import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createArea,
  createFeeder,
  createSubstation,
  createZone,
  deleteArea,
  deleteFeeder,
  deleteSubstation,
  deleteZone,
  getAreaById,
  getAreas,
  getFeederById,
  getFeeders,
  getSubstationById,
  getSubstations,
  getZoneById,
  getZones,
  updateArea,
  updateFeeder,
  updateSubstation,
  updateZone,
} from "@/api/grid.api";

export const useZones = (filters?: {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["zones", filters],
    queryFn: () => getZones(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useZone = (id: string) => {
  return useQuery({
    queryKey: ["zone", id],
    queryFn: () => getZoneById(id),
    enabled: !!id,
  });
};

export const useCreateZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success("Zone created!");
    },
  });
};

export const useUpdateZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name: string } }) =>
      updateZone(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success("Zone updated!");
    },
  });
};

export const useDeleteZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success("Zone deleted");
    },
  });
};

export const useSubstations = (filters?: {
  searchTerm?: string;
  zoneId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["substations", filters],
    queryFn: () => getSubstations(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubstation = (id: string) => {
  return useQuery({
    queryKey: ["substation", id],
    queryFn: () => getSubstationById(id),
    enabled: !!id,
  });
};

export const useCreateSubstation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      code,
      zoneId,
    }: {
      name: string;
      code?: string;
      zoneId: string;
    }) => createSubstation({ name, code, zoneId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["substations"] });
      toast.success("Substation created!");
    },
  });
};

export const useUpdateSubstation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { name: string; zoneId: string };
    }) => updateSubstation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["substations"] });
      toast.success("Substation updated!");
    },
  });
};

export const useDeleteSubstation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSubstation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["substations"] });
      toast.success("Substation deleted");
    },
  });
};

export const useFeeders = (filters?: {
  searchTerm?: string;
  substationId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["feeders", filters],
    queryFn: () => getFeeders(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeeder = (id: string) => {
  return useQuery({
    queryKey: ["feeder", id],
    queryFn: () => getFeederById(id),
    enabled: !!id,
  });
};

export const useCreateFeeder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      code,
      substationId,
    }: {
      name: string;
      code?: string;
      substationId: string;
    }) => createFeeder({ name, code, substationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeders"] });
      toast.success("Feeder created!");
    },
  });
};

export const useUpdateFeeder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { name: string; substationId: string };
    }) => updateFeeder(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeders"] });
      toast.success("Feeder updated!");
    },
  });
};

export const useDeleteFeeder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFeeder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeders"] });
      toast.success("Feeder deleted");
    },
  });
};

export const useAreas = (filters?: {
  searchTerm?: string;
  feederId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["areas", filters],
    queryFn: () => getAreas(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useArea = (id: string) => {
  return useQuery({
    queryKey: ["area", id],
    queryFn: () => getAreaById(id),
    enabled: !!id,
  });
};

export const useCreateArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      code,
      feederId,
    }: {
      name: string;
      code?: string;
      feederId: string;
    }) => createArea({ name, code, feederId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast.success("Area created!");
    },
  });
};

export const useUpdateArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { name: string; feederId: string };
    }) => updateArea(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast.success("Area updated!");
    },
  });
};

export const useDeleteArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteArea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast.success("Area deleted");
    },
  });
};
