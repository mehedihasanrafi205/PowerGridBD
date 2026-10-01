export interface ZonePayload {
  name: string;
}

export interface SubstationPayload {
  name: string;
  zoneId: string;
}

export interface FeederPayload {
  name: string;
  substationId: string;
}

export interface AreaPayload {
  name: string;
  feederId: string;
}

export interface ZoneFilters {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SubstationFilters {
  searchTerm?: string;
  zoneId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FeederFilters {
  searchTerm?: string;
  substationId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AreaFilters {
  searchTerm?: string;
  feederId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Zone {
  id: string;
  name: string;
  substations?: Substation[];
  createdAt: string;
  updatedAt: string;
}

export interface Substation {
  id: string;
  name: string;
  zoneId: string;
  zone?: Zone;
  feeders?: Feeder[];
  createdAt: string;
  updatedAt: string;
}

export interface Feeder {
  id: string;
  name: string;
  substationId: string;
  substation?: Substation;
  areas?: Area[];
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  name: string;
  feederId: string;
  feeder?: Feeder;
  createdAt: string;
  updatedAt: string;
}

export interface ZonePaginatedResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Zone[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SubstationPaginatedResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Substation[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FeederPaginatedResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Feeder[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AreaPaginatedResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Area[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ZoneDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Zone;
}

export interface SubstationDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Substation;
}

export interface FeederDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Feeder;
}

export interface AreaDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Area;
}