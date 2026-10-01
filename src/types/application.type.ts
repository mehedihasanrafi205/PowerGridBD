export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ApplicationPayload {
  name: string;
  email: string;
  phone: string;
  experience: number;
  skills?: string;
  motivation?: string;
}

export interface ApplicationReviewPayload {
  status: "APPROVED" | "REJECTED";
  reason?: string;
}

export interface ApplicationFilters {
  status?: ApplicationStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  experienceYears?: number;
  skills?: string;
  motivation?: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewer?: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationPaginatedResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Application[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApplicationDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Application;
}

export interface ApplicationStatusResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Application;
}