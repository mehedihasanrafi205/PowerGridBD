import {
  getUsers,
  getUserById,
  updateProfile,
  updateProfileImage,
  updateUserStatus,
  updateUserRole,
  deleteUser,
} from "@/api/user.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UserFilters, UserUpdatePayload, UserStatusPayload, UserRolePayload } from "@/types";

export const useUsers = (filters?: { searchTerm?: string; role?: string; status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc" }) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
    staleTime: 60 * 1000,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name?: string; phone?: string; address?: string }) => updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Profile updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
};

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => updateProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Profile image updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update image");
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status: "ACTIVE" | "BLOCKED" } }) => updateUserStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("User status updated!");
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { role: "CUSTOMER" | "TECHNICIAN" | "POWER_OPERATOR" | "ADMIN" } }) => updateUserRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("User role updated!");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted");
    },
  });
};