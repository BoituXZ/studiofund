import { apiClient, type ApiError } from './client';

export interface VerificationResponse {
  transactionId: string;
  verified: boolean;
  batchId: string;
  merkleProof?: {
    path: string[];
    leaf: string;
    root: string;
  };
  transactionDetails?: {
    type: string;
    amount: number | string;
    timestamp: string;
    poolId: string;
  };
}

export interface AuditTrailResponse {
  poolId: string;
  transactions: {
    id: string;
    type: string;
    amount: number | string;
    timestamp: string;
    batchId: string;
    verified: boolean;
  }[];
  batches: {
    id: string;
    transactionCount: number;
    merkleRoot: string;
    createdAt: string;
  }[];
}

export interface BatchVerificationResponse {
  batchId: string;
  transactionCount: number;
  merkleRoot: string;
  verified: boolean;
  transactions: {
    id: string;
    type: string;
    amount: number | string;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface Batch {
  id: string;
  transactionCount: number;
  merkleRoot: string;
  createdAt: string;
}

export interface BatchesResponse {
  batches: Batch[];
  total: number;
  page: number;
  limit: number;
}

export const dltApi = {
  async verifyTransaction(transactionId: string): Promise<VerificationResponse> {
    try {
      return await apiClient.get<VerificationResponse>(`/api/v1/dlt/verify/${transactionId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getAuditTrail(poolId: string): Promise<AuditTrailResponse> {
    try {
      return await apiClient.get<AuditTrailResponse>(`/api/v1/dlt/audit/${poolId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async verifyBatch(batchId: string): Promise<BatchVerificationResponse> {
    try {
      return await apiClient.get<BatchVerificationResponse>(`/api/v1/dlt/batch/${batchId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getAllBatches(page = 1, limit = 50): Promise<BatchesResponse> {
    try {
      return await apiClient.get<BatchesResponse>(`/api/v1/dlt/batches?page=${page}&limit=${limit}`);
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

