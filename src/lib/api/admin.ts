import { apiClient, type ApiError } from './client';

export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalGroups: number;
  activeGroups: number;
  totalBusinesses: number;
  pendingBusinesses: number;
  verifiedBusinesses: number;
  totalInvestments: number;
  activeInvestments: number;
  totalPoolBalance: number;
  totalClaims: number;
  pendingClaims: number;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  sector: string;
  location: string;
  ownerName: string;
  ownerPhone: string;
  capitalNeeded: number | string;
  interestRate: number | string;
  riskScore?: number | string;
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'ACTIVE' | 'SUSPENDED' | 'BLACKLISTED';
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  phone: string;
  email?: string;
  firstName: string;
  lastName: string;
  role: 'MEMBER' | 'GROUP_ADMIN' | 'PLATFORM_ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AdminGroup {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  memberCount: number;
  poolBalance: number;
  createdAt: string;
}

export interface UpdateBusinessStatusRequest {
  status: 'VERIFIED' | 'SUSPENDED' | 'BLACKLISTED';
}

export interface UpdateUserStatusRequest {
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
}

export interface UpdateUserRoleRequest {
  role: 'MEMBER' | 'GROUP_ADMIN' | 'PLATFORM_ADMIN';
}

export const adminApi = {
  async getStats(): Promise<PlatformStats> {
    try {
      // For now, we'll calculate stats from multiple endpoints
      // In the future, create a dedicated stats endpoint
      const [users, groups, businesses, investments] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getGroups(),
        adminApi.getBusinesses(),
        adminApi.getInvestments(),
      ]);

      const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
      const suspendedUsers = users.filter(u => u.status === 'SUSPENDED').length;
      const activeGroups = groups.filter(g => g.status === 'ACTIVE').length;
      const pendingBusinesses = businesses.filter(b => b.status === 'PENDING_VERIFICATION').length;
      const verifiedBusinesses = businesses.filter(b => b.status === 'VERIFIED' || b.status === 'ACTIVE').length;
      const activeInvestments = investments.filter(i => i.status === 'ACTIVE').length;
      const totalPoolBalance = groups.reduce((sum, g) => sum + (g.poolBalance || 0), 0);

      return {
        totalUsers: users.length,
        activeUsers,
        suspendedUsers,
        totalGroups: groups.length,
        activeGroups,
        totalBusinesses: businesses.length,
        pendingBusinesses,
        verifiedBusinesses,
        totalInvestments: investments.length,
        activeInvestments,
        totalPoolBalance,
        totalClaims: 0, // TODO: Add claims endpoint
        pendingClaims: 0, // TODO: Add claims endpoint
      };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getBusinesses(status?: string): Promise<Business[]> {
    try {
      const url = status 
        ? `/api/v1/businesses?status=${status}`
        : '/api/v1/businesses';
      const response = await apiClient.get<{ businesses: Business[] } | Business[]>(url);
      // Handle both response formats
      if (Array.isArray(response)) {
        return response;
      }
      return response.businesses || [];
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getBusiness(id: string): Promise<Business> {
    try {
      return await apiClient.get<Business>(`/api/v1/businesses/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async verifyBusiness(id: string): Promise<Business> {
    try {
      return await apiClient.put<Business>(`/api/v1/businesses/${id}/verify`, {});
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async updateBusinessStatus(id: string, status: 'VERIFIED' | 'SUSPENDED' | 'BLACKLISTED'): Promise<Business> {
    try {
      // For VERIFIED, use the verify endpoint
      if (status === 'VERIFIED') {
        return await adminApi.verifyBusiness(id);
      }
      // For SUSPENDED and BLACKLISTED, use the update endpoint
      return await apiClient.put<Business>(`/api/v1/businesses/${id}`, { status });
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getUsers(status?: string, role?: string): Promise<AdminUser[]> {
    try {
      // Note: This endpoint doesn't exist yet, so we'll need to create it
      // For now, return empty array and log
      console.warn('Admin users endpoint not implemented yet');
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getUser(id: string): Promise<AdminUser> {
    try {
      // Note: This endpoint doesn't exist yet
      throw new Error('Admin user endpoint not implemented');
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async updateUserStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'): Promise<AdminUser> {
    try {
      // Note: This endpoint doesn't exist yet
      throw new Error('Admin user status update endpoint not implemented');
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async updateUserRole(id: string, role: 'MEMBER' | 'GROUP_ADMIN' | 'PLATFORM_ADMIN'): Promise<AdminUser> {
    try {
      // Note: This endpoint doesn't exist yet
      throw new Error('Admin user role update endpoint not implemented');
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getGroups(status?: string): Promise<AdminGroup[]> {
    try {
      // Use the regular groups endpoint - platform admin can see all groups
      const groups = await apiClient.get<any[]>('/api/v1/groups');
      return groups.map(g => ({
        id: g.id,
        name: g.name,
        description: g.description,
        status: g.status,
        memberCount: g.memberCount || 0,
        poolBalance: g.pool?.totalBalance ? Number(g.pool.totalBalance) : 0,
        createdAt: g.createdAt,
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getInvestments(): Promise<any[]> {
    try {
      return await apiClient.get<any[]>('/api/v1/investments');
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

