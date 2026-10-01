export type ScheduleStatus = "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
export type ScheduleType = "FEEDER" | "AREA";
export type ScheduleRecurrence = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface SchedulePayload {
  title: string;
  type: ScheduleType;
  description?: string;
  feederId?: string;
  areaId?: string;
  startTime: string;
  endTime: string;
  reason?: string;
  recurrence?: ScheduleRecurrence;
  recurrenceDays?: string[];
}

export interface ScheduleUpdatePayload {
  title?: string;
  type?: ScheduleType;
  description?: string;
  feederId?: string;
  areaId?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  recurrence?: ScheduleRecurrence;
  recurrenceDays?: string[];
}

export interface ScheduleStatusPayload {
  status: ScheduleStatus;
}

export interface ScheduleFilters {
  status?: ScheduleStatus[];
  type?: ScheduleType[];
  feederId?: string;
  areaId?: string;
  from?: string;
  to?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Schedule {
  id: string;
  title: string;
  type: ScheduleType;
  description?: string;
  feederId?: string;
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
  areaId?: string;
  area?: {
    id: string;
    name: string;
    feeder?: {
      id: string;
      name: string;
    };
  };
  startTime: string;
  endTime: string;
  reason?: string;
  status: ScheduleStatus;
  recurrence?: ScheduleRecurrence;
  recurrenceDays?: string[];
  createdBy: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SchedulePaginatedResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Schedule[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ScheduleDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Schedule;
}