export type OutageStatus =
  | "PENDING"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "RESTORED"
  | "CANCELLED"
  | "FAILED";

export interface OutagePayload {
  description: string;
  areaId: string;
  isPriority?: boolean;
}

export interface OutageStatusPayload {
  status: OutageStatus;
  notes?: string;
}

export interface OutageFilters {
  status?: OutageStatus[];
  areaId?: string;
  isPriority?: boolean;
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  from?: string;
  to?: string;
}

export interface Outage {
  id: string;
  description: string;
  areaId: string;
  area?: {
    id: string;
    name: string;
    feeder?: {
      id: string;
      name: string;
      substation?: {
        id: string;
        name: string;
        zone?: {
          id: string;
          name: string;
        };
      };
    };
  };
  customerId: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  technicianId?: string;
  technician?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  status: OutageStatus;
  isPriority: boolean;
  reportedAt: string;
  assignedAt?: string;
  inProgressAt?: string;
  resolvedAt?: string;
  restoredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  resolutionNotes?: string;
  feeder?: {
    id: string;
    name: string;
    substation?: {
      id: string;
      name: string;
      zone?: {
        id: string;
        name: string;
      };
    };
  };
}

export interface OutagePaginatedResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Outage[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OutageDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Outage;
}
