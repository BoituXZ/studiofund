import { apiClient, type ApiError } from './client';

export interface Claim {
  id: string;
  groupId: string;
  userId: string;
  amount: number | string;
  reason: string;
  description?: string;
  supportingDocuments?: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
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

export interface CreateClaimRequest {
  groupId: string;
  amount: number;
  reason: string;
  description?: string;
  supportingDocuments?: string[];
}

export interface ReviewClaimRequest {
  approve: boolean;
  notes?: string;
}

export const claimsApi = {
  async create(data: CreateClaimRequest): Promise<Claim> {
    try {
      return await apiClient.post<Claim>('/api/v1/claims', data);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getAll(filters?: {
    groupId?: string;
    userId?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  }): Promise<Claim[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.groupId) params.append('groupId', filters.groupId);
      if (filters?.userId) params.append('userId', filters.userId);
      if (filters?.status) params.append('status', filters.status);
      
      const queryString = params.toString();
      const url = queryString ? `/api/v1/claims?${queryString}` : '/api/v1/claims';
      return await apiClient.get<Claim[]>(url);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getById(id: string): Promise<Claim> {
    try {
      return await apiClient.get<Claim>(`/api/v1/claims/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async review(claimId: string, data: ReviewClaimRequest): Promise<Claim> {
    try {
      return await apiClient.put<Claim>(`/api/v1/claims/${claimId}/review`, data);
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

