import { apiClient, type ApiError } from './client';

export interface Business {
  id: string;
  name: string;
  description: string;
  sector: string;
  location: string;
  address?: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  capitalNeeded: number | string;
  repaymentPeriodDays: number;
  interestRate: number | string;
  riskScore?: number | string;
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'ACTIVE' | 'SUSPENDED' | 'BLACKLISTED';
  verifiedBy?: string;
  verifiedAt?: string;
  registrationDoc?: string;
  idDocument?: string;
  proofOfAddress?: string;
  businessAge?: number;
  previousLoans: number;
  successfulRepayments: number;
  createdAt: string;
  updatedAt: string;
  fundingProgress?: number;
  investments?: Investment[];
}

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
  returns?: InvestmentReturn[];
}

export interface InvestmentReturn {
  id: string;
  investmentId: string;
  amount: number | string;
  notes?: string;
  receiptUrl?: string;
  returnDate: string;
  createdAt?: string; // For backward compatibility
}

export interface BusinessStats {
  totalCapitalRaised: number;
  capitalNeeded: number;
  fundingProgress: number;
  activeInvestments: number;
  completedInvestments: number;
  totalInvestmentsReceived: number;
  totalReturnsPaid: number;
  outstandingReturns: number;
}

export interface UpdateBusinessRequest {
  name?: string;
  description?: string;
  location?: string;
  address?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  capitalNeeded?: number;
  repaymentPeriodDays?: number;
  interestRate?: number;
}

export interface RecordReturnRequest {
  amount: number;
  notes?: string;
  receiptUrl?: string;
}

export interface CreateBusinessRequest {
  name: string;
  description: string;
  sector: string;
  location: string;
  address?: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  capitalNeeded: number;
  repaymentPeriodDays: number;
  interestRate: number;
  registrationDoc?: string;
  idDocument?: string;
  proofOfAddress?: string;
}

export interface BusinessListResponse {
  businesses: Business[];
  total: number;
  page: number;
  limit: number;
}

export const businessApi = {
  // Business owner endpoints
  async getMyBusiness(): Promise<Business> {
    try {
      return await apiClient.get<Business>('/api/v1/business/my-business');
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async updateMyBusiness(data: UpdateBusinessRequest): Promise<Business> {
    try {
      return await apiClient.put<Business>('/api/v1/business/my-business', data);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getMyBusinessStats(): Promise<BusinessStats> {
    try {
      return await apiClient.get<BusinessStats>('/api/v1/business/my-business/stats');
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getMyBusinessInvestments(status?: string): Promise<Investment[]> {
    try {
      const url = status
        ? `/api/v1/business/my-business/investments?status=${status}`
        : '/api/v1/business/my-business/investments';
      return await apiClient.get<Investment[]>(url);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getInvestmentDetails(investmentId: string): Promise<Investment> {
    try {
      return await apiClient.get<Investment>(`/api/v1/business/my-business/investments/${investmentId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async recordReturn(investmentId: string, data: RecordReturnRequest): Promise<Investment> {
    try {
      return await apiClient.post<Investment>(
        `/api/v1/business/my-business/investments/${investmentId}/return`,
        data
      );
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getMyBusinessTransactions(): Promise<any[]> {
    try {
      return await apiClient.get<any[]>('/api/v1/business/my-business/transactions');
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Regular user endpoints (for browsing and investing)
  async getAll(filters?: {
    sector?: string;
    status?: string;
    minRiskScore?: number;
    maxRiskScore?: number;
    page?: number;
    limit?: number;
  }): Promise<BusinessListResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.sector) params.append('sector', filters.sector);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.minRiskScore !== undefined) params.append('minRiskScore', filters.minRiskScore.toString());
      if (filters?.maxRiskScore !== undefined) params.append('maxRiskScore', filters.maxRiskScore.toString());
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/api/v1/businesses?${queryString}` : '/api/v1/businesses';
      return await apiClient.get<BusinessListResponse>(url);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getAvailable(): Promise<Business[]> {
    try {
      return await apiClient.get<Business[]>('/api/v1/businesses/available');
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getById(id: string): Promise<Business> {
    try {
      return await apiClient.get<Business>(`/api/v1/businesses/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async create(data: CreateBusinessRequest): Promise<Business> {
    try {
      return await apiClient.post<Business>('/api/v1/businesses', data);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async verify(id: string): Promise<Business> {
    try {
      return await apiClient.put<Business>(`/api/v1/businesses/${id}/verify`);
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

