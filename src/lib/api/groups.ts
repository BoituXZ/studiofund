import { apiClient, type ApiError } from './client';
import { contributionsApi } from './contributions';
import type { ContributionSummary } from './contributions';

export interface Group {
  id: string;
  name: string;
  description?: string;
  monthlyContribution: number | string; // Can be Decimal from backend
  minimumMembers: number;
  maximumMembers: number;
  contributionDay: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  pool?: {
    id: string;
    totalBalance: number | string; // Can be Decimal from backend
    availableBalance: number | string;
    investedAmount: number | string;
    reservedForClaims: number | string;
  };
  members?: GroupMember[] | number; // Can be array of members or just count
  // For frontend display
  role?: 'Admin' | 'Member';
  poolBalance?: number;
  yourContribution?: {
    paid: number;
    total: number;
  };
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'ACTIVE' | 'PENDING' | 'LEFT' | 'REMOVED';
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };
  acceptedAt?: string;
  joinedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  monthlyContribution: number;
  minimumMembers?: number;
  maximumMembers?: number;
  contributionDay?: number;
}

export interface PoolTransaction {
  id: string;
  poolId: string;
  type: string;
  amount: number;
  description?: string;
  createdAt: string;
  contribution?: {
    id: string;
    member: {
      user: {
        firstName: string;
        lastName: string;
      };
    };
  };
  investment?: {
    id: string;
    business: {
      name: string;
    };
  };
}

export interface PoolTransactionsResponse {
  transactions: PoolTransaction[];
  total: number;
  page: number;
  limit: number;
}

export const groupsApi = {
  async getAll(): Promise<Group[]> {
    try {
      const groups = await apiClient.get<Group[]>('/api/v1/groups');
      // Transform the data to match frontend expectations
      const groupsWithContributions = await Promise.all(
        groups.map(async (group) => {
          const membersArray = Array.isArray(group.members) ? group.members : [];
          const userMembership = membersArray.find((m: GroupMember) => m.status === 'ACTIVE');
          const role = userMembership?.role === 'ADMIN' ? 'Admin' : 'Member';
          
          // Fetch contribution summary for this group
          let contributionSummary: ContributionSummary | null = null;
          try {
            contributionSummary = await contributionsApi.getSummary(group.id);
          } catch (error) {
            // If summary fails, continue with default values
            console.error(`Failed to fetch contribution summary for group ${group.id}:`, error);
          }
          
          return {
            ...group,
            poolBalance: group.pool?.totalBalance ? Number(group.pool.totalBalance) : 0,
            role,
            yourContribution: {
              paid: contributionSummary?.totalPaid || 0,
              total: Number(group.monthlyContribution),
            },
            members: group.memberCount || (Array.isArray(group.members) ? group.members.length : 0),
          };
        })
      );
      
      return groupsWithContributions;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getById(id: string): Promise<Group> {
    try {
      const group = await apiClient.get<Group>(`/api/v1/groups/${id}`);
      // Transform the data
      const membersArray = Array.isArray(group.members) ? group.members : [];
      const userMembership = membersArray.find((m: GroupMember) => m.status === 'ACTIVE');
      const role = userMembership?.role === 'ADMIN' ? 'Admin' : 'Member';
      
      // Fetch contribution summary for this group
      let contributionSummary: ContributionSummary | null = null;
      try {
        contributionSummary = await contributionsApi.getSummary(id);
      } catch (error) {
        console.error(`Failed to fetch contribution summary for group ${id}:`, error);
      }
      
      return {
        ...group,
        poolBalance: group.pool?.totalBalance ? Number(group.pool.totalBalance) : 0,
        role,
        members: group.memberCount || membersArray.length || 0,
        yourContribution: {
          paid: contributionSummary?.totalPaid || 0,
          total: Number(group.monthlyContribution),
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async create(data: CreateGroupRequest): Promise<Group> {
    try {
      const group = await apiClient.post<Group>('/api/v1/groups', data);
      return {
        ...group,
        poolBalance: 0,
        role: 'Admin',
        members: 1,
        yourContribution: {
          paid: 0,
          total: Number(group.monthlyContribution),
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getPool(id: string): Promise<Group['pool']> {
    try {
      return await apiClient.get<Group['pool']>(`/api/v1/groups/${id}/pool`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getPoolTransactions(
    id: string,
    page = 1,
    limit = 50,
  ): Promise<PoolTransactionsResponse> {
    try {
      return await apiClient.get<PoolTransactionsResponse>(
        `/api/v1/groups/${id}/pool/transactions?page=${page}&limit=${limit}`,
      );
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getMembers(id: string): Promise<GroupMember[]> {
    try {
      return await apiClient.get<GroupMember[]>(`/api/v1/groups/${id}/members`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async inviteMember(groupId: string, phone: string, role?: 'ADMIN' | 'MEMBER'): Promise<GroupMember> {
    try {
      return await apiClient.post<GroupMember>(`/api/v1/groups/${groupId}/members`, {
        phone,
        role: role || 'MEMBER',
      });
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async acceptInvitation(groupId: string, memberId: string, accept: boolean): Promise<GroupMember> {
    try {
      return await apiClient.put<GroupMember>(`/api/v1/groups/${groupId}/members/${memberId}/accept`, {
        accept,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async removeMember(groupId: string, memberId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/groups/${groupId}/members/${memberId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async update(id: string, data: Partial<CreateGroupRequest>): Promise<Group> {
    try {
      return await apiClient.put<Group>(`/api/v1/groups/${id}`, data);
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

