export type PaymentType = "PRIORITY_RESTORATION" | "SLA_SUBSCRIPTION";
export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface PaymentInitiatePayload {
  type: PaymentType;
  amount: number;
  outageId?: string;
  planId?: string;
}

export interface PaymentFilters {
  searchTerm?: string;
  status?: PaymentStatus[];
  type?: PaymentType[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Payment {
  id: string;
  transactionId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  outageId?: string;
  outage?: {
    id: string;
    description: string;
  };
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: string;
  gateway?: string;
  paymentDetails?: {
    sessionkey?: string;
    status?: string;
    store_id?: string;
    failedreason?: string;
    validation?: {
      val_id?: string;
      status?: string;
      card_type?: string;
      card_no?: string;
      bank_tran_id?: string;
      tran_date?: string;
      tran_amount?: string;
    };
    refund?: {
      status?: string;
      amount?: string;
      reason?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInitiateResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    transactionId: string;
    gatewayUrl: string;
  };
}

export interface PaymentPaginatedResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Payment[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaymentDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Payment;
}
