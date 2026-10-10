export interface OperationalAnalytics {
  activeOutages: number;
  priorityOutages: number;
  // The backend returns these either as bare numbers or as
  // `{ count, ... }` envelopes — always read via asCount().
  availableTechnicians: number | { count: number; technicians: unknown[] };
  totalTechnicians: number;
  activeSchedules: number;
  criticalFeedersDown: number | { count: number; feeders: unknown[] };
  totalUsers?: number;
  criticalFeeders?: number;
  mttr?: number;
  avgAssignmentTime?: number;
  firstTimeFixRate?: number;
}

export interface PerformanceAnalytics {
  mttr: number; // Mean Time To Resolution in hours
  avgAssignmentTime: number; // in hours
  technicianWorkload: Array<{
    technicianId: string;
    technicianName: string;
    assignedCount: number;
    resolvedCount: number;
    avgResolutionTime: number;
  }>;
  firstTimeFixRate: number; // percentage
}

export interface GeographicalAnalytics {
  outageByArea: Array<{
    areaId: string;
    areaName: string;
    outageCount: number;
  }>;
  outageByZone: Array<{
    zoneId: string;
    zoneName: string;
    outageCount: number;
  }>;
  topWorstFeeders: Array<{
    feederId: string;
    feederName: string;
    outageCount: number;
  }>;
}

export interface FinancialAnalytics {
  totalRevenue: number;
  revenueByType: {
    priorityRestoration: number;
    slaSubscription: number;
  };
  successRate: number;
  paymentsByStatus: {
    success: number;
    failed: number;
    pending: number;
    cancelled: number;
  };
  activeSlaSubscriptions: number;
}

export interface TrendsAnalytics {
  dailyOutages: Array<{
    date: string;
    count: number;
  }>;
  peakLoadSheddingHours: Array<{
    hour: number;
    count: number;
  }>;
}

export interface CustomerSummary {
  totalReports: number;
  reportsByStatus: Record<string, number>;
  priorityCount: number;
  totalPaid: number;
  slaActive?: boolean;
  slaExpiryDate?: string;
}

export interface TechnicianSummary {
  assignedCount: number;
  ongoingCount: number;
  resolvedCount: number;
  avgResolutionTime: number;
  firstTimeFixRate?: number;
}

export interface TechnicianWorkloadResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    technicianWorkload: Array<{
      technicianId: string;
      technicianName: string;
      assignedCount: number;
      resolvedCount: number;
      avgResolutionTime: number;
      firstTimeFixRate: number;
    }>;
  };
}

export interface SlaPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  features: string[];
}

export interface SlaPlanResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SlaPlan[];
}

export interface SlaSubscribePayload {
  planId: string;
}

export interface SlaSubscribeResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    paymentUrl: string;
    transactionId: string;
    plan: {
      id: string;
      name: string;
      tier: string;
      price: number;
      durationDays: number;
    };
  };
}

export interface AuditLogFilters {
  entity?: string;
  action?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AuditLog {
  id: string;
  entity: string;
  entityId: string;
  action: string;
  actorId: string;
  actor?: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLogResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AuditLog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OperationalAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: OperationalAnalytics;
}

export interface PerformanceAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PerformanceAnalytics;
}

export interface GeographicalAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: GeographicalAnalytics;
}

export interface FinancialAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: FinancialAnalytics;
}

export interface TrendsAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TrendsAnalytics;
}

export interface CustomerSummaryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CustomerSummary;
}

export interface TechnicianSummaryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TechnicianSummary;
}

export interface TechnicianWorkloadResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    technicianWorkload: Array<{
      technicianId: string;
      technicianName: string;
      assignedCount: number;
      resolvedCount: number;
      avgResolutionTime: number;
      firstTimeFixRate: number;
    }>;
  };
}

export interface SlaPlanResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SlaPlan[];
}
