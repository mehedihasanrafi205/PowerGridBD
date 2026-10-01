export type Role = "CUSTOMER" | "TECHNICIAN" | "POWER_OPERATOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyAccountPayload {
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface GoogleOAuthPayload {
  idToken: string;
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
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    user: User;
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
