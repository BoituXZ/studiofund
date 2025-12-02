import { apiClient, type ApiError } from './client';

export interface Investment {
  id: string;
  groupId: string;
  businessId: string;
  amount: number | string;
  expectedReturn: number | string;
  actualReturn?: number | string;
  startDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'DEFAULTED';
  profitDistributed: boolean;
  roi?: number;
  createdAt: string;
  updatedAt: string;
  group?: {
    id: string;
    name: string;
  };
  business?: {
    id: string;
    name: string;
    sector: string;
  };
  returns?: InvestmentReturn[];
}

export interface InvestmentReturn {
  id: string;
  investmentId: string;
  amount: number | string;
  returnDate: string;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface CreateInvestmentRequest {
  groupId: string;
  businessId: string;
  amount: number;
}

export interface RecordReturnRequest {
  amount: number;
  notes?: string;
  receiptUrl?: string;
}

export const investmentsApi = {
  async create(data: CreateInvestmentRequest): Promise<Investment> {
    try {
      return await apiClient.post<Investment>('/api/v1/investments', data);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getAll(filters?: {
    groupId?: string;
    businessId?: string;
    status?: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'DEFAULTED';
  }): Promise<Investment[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.groupId) params.append('groupId', filters.groupId);
      if (filters?.businessId) params.append('businessId', filters.businessId);
      if (filters?.status) params.append('status', filters.status);
      
      const queryString = params.toString();
      const url = queryString ? `/api/v1/investments?${queryString}` : '/api/v1/investments';
      return await apiClient.get<Investment[]>(url);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getById(id: string): Promise<Investment> {
    try {
      return await apiClient.get<Investment>(`/api/v1/investments/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async recordReturn(investmentId: string, data: RecordReturnRequest): Promise<Investment> {
    try {
      return await apiClient.put<Investment>(`/api/v1/investments/${investmentId}/return`, data);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async distributeProfit(investmentId: string): Promise<{ message: string }> {
    try {
      return await apiClient.post<{ message: string }>(`/api/v1/investments/${investmentId}/distribute-profit`);
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

