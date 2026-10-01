import { Role, UserStatus, User } from "./auth.type";

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
