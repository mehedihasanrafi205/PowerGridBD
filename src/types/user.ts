import { Role, UserStatus } from "./auth";

export interface UserFilters {
  searchTerm?: string;
  role?: Role;
  status?: UserStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UserUpdatePayload {
  name?: string;
  phone?: string;
  address?: string;
}

export interface UserStatusPayload {
  status: UserStatus;
}

export interface UserRolePayload {
  role: Role;
}

export interface UserPaginatedResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User;
}

export interface UserProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: Role;
  status: UserStatus;
  profileImage?: string;
  slaActive?: boolean;
  slaExpiryDate?: string;
  createdAt: string;
  updatedAt: string;
}