import { apiClient, type ApiError } from './client';

export interface Withdrawal {
  id: string;
  groupId: string;
  userId: string;
  amount: number | string;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  group?: {
    id: string;
    name: string;
  };
  reviewer?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateWithdrawalRequest {
  groupId: string;
  amount: number;
  reason?: string;
}

export interface ReviewWithdrawalRequest {
  approve: boolean;
  notes?: string;
}

export const withdrawalsApi = {
  async create(data: CreateWithdrawalRequest): Promise<Withdrawal> {
    try {
      return await apiClient.post<Withdrawal>('/api/v1/withdrawals', data);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getAll(filters?: {
    groupId?: string;
    userId?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  }): Promise<Withdrawal[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.groupId) params.append('groupId', filters.groupId);
      if (filters?.userId) params.append('userId', filters.userId);
      if (filters?.status) params.append('status', filters.status);
      
      const queryString = params.toString();
      const url = queryString ? `/api/v1/withdrawals?${queryString}` : '/api/v1/withdrawals';
      return await apiClient.get<Withdrawal[]>(url);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getById(id: string): Promise<Withdrawal> {
    try {
      return await apiClient.get<Withdrawal>(`/api/v1/withdrawals/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async review(withdrawalId: string, data: ReviewWithdrawalRequest): Promise<Withdrawal> {
    try {
      return await apiClient.put<Withdrawal>(`/api/v1/withdrawals/${withdrawalId}/review`, data);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      return error as ApiError;
    }
    return {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      statusCode: 0,
    };
  },
};

