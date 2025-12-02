import { apiClient, type ApiError } from './client';

export interface Contribution {
  id: string;
  groupId: string;
  userId: string;
  amount: number | string;
  month: number;
  year: number;
  paymentMethod?: string;
  paymentReference?: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  confirmedAt?: string;
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
}

export interface ContributionSummary {
  totalPaid: number;
  totalPending: number;
  totalFailed: number;
  contributionCount: number;
}

export interface CreateContributionRequest {
  groupId: string;
  amount: number;
  month: number;
  year: number;
  paymentMethod?: string;
  paymentReference?: string;
}

export interface ConfirmContributionRequest {
  confirm: boolean;
  notes?: string;
}

export const contributionsApi = {
  async create(data: CreateContributionRequest): Promise<Contribution> {
    try {
      return await apiClient.post<Contribution>('/api/v1/contributions', data);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getByGroup(groupId: string): Promise<Contribution[]> {
    try {
      return await apiClient.get<Contribution[]>(`/api/v1/contributions/group/${groupId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getByUser(userId: string): Promise<Contribution[]> {
    try {
      return await apiClient.get<Contribution[]>(`/api/v1/contributions/user/${userId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getSummary(groupId?: string): Promise<ContributionSummary> {
    try {
      const url = groupId 
        ? `/api/v1/contributions/summary?groupId=${groupId}`
        : '/api/v1/contributions/summary';
      return await apiClient.get<ContributionSummary>(url);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async confirm(contributionId: string, data: ConfirmContributionRequest): Promise<Contribution> {
    try {
      return await apiClient.put<Contribution>(`/api/v1/contributions/${contributionId}/confirm`, data);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      return error as ApiError;
    }
    return {
      message: 'An unexpected error occurred',
      statusCode: 0,
    };
  },
};

