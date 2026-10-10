import apiClient from "@/lib/apiClient";
import type {
  TechnicianListResponse,
  UserDetailResponse,
  UserFilters,
  UserPaginatedResponse,
  UserProfileResponse,
  UserRolePayload,
  UserStatusPayload,
  UserUpdatePayload,
} from "@/types";

export const getUsers = (params?: UserFilters) => {
  const searchParams = new URLSearchParams();
  if (params?.searchTerm) searchParams.append("searchTerm", params.searchTerm);
  if (params?.role) searchParams.append("role", params.role);
  if (params?.status) searchParams.append("status", params.status);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  return apiClient<UserPaginatedResponse>(`/user?${searchParams.toString()}`);
};

export const getTechnicians = (
  params?: Pick<UserFilters, "page" | "limit">,
) => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  return apiClient<TechnicianListResponse>(
    `/user/technicians?${searchParams.toString()}`,
  );
};

export const getUserById = (id: string) =>
  apiClient<UserDetailResponse>(`/user/${id}`);

export const updateProfile = (payload: UserUpdatePayload) =>
  apiClient<UserProfileResponse>("/user/profile", {
    method: "PATCH",
    body: payload,
  });

export const updateProfileImage = (file: File) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  return apiClient<UserProfileResponse>("/user/profile-image", {
    method: "PATCH",
    body: formData,
  });
};

export const updateUserStatus = (id: string, payload: UserStatusPayload) =>
  apiClient<UserDetailResponse>(`/user/${id}/status`, {
    method: "PATCH",
    body: payload,
  });

export const updateUserRole = (id: string, payload: UserRolePayload) =>
  apiClient<UserDetailResponse>(`/user/${id}/role`, {
    method: "PATCH",
    body: payload,
  });

export const deleteUser = (id: string) =>
  apiClient<{ success: boolean; statusCode: number; message: string }>(
    `/user/${id}`,
    {
      method: "DELETE",
    },
  );
