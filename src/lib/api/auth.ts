import { apiClient, type ApiError } from './client';

export interface LoginRequest {
  identifier: string; // phone or email
  password: string;
}

export interface RegisterRequest {
  phone: string; // Full international format: +263771234567
  email?: string;
  password: string;
  firstName: string;
  lastName: string;
  nationalId?: string;
}

export interface User {
  id: string;
  phone: string;
  email?: string;
  firstName: string;
  lastName: string;
  role: 'MEMBER' | 'GROUP_ADMIN' | 'PLATFORM_ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  profileImage?: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      return await apiClient.post<AuthResponse>('/api/v1/auth/login', credentials);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      return await apiClient.post<AuthResponse>('/api/v1/auth/register', data);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      return await apiClient.get<User>('/api/v1/auth/me');
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      return await apiClient.post<AuthResponse>('/api/v1/auth/refresh', {
        refreshToken,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch (error) {
      // Even if logout fails, clear local storage
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
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

// Token management helpers
export const tokenStorage = {
  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  },

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  },

  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
};

