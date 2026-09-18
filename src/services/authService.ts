import apiClient, { tokenManager } from '../lib/api';
import { ENDPOINTS } from '../utils/apiendpoint';

export interface LoginResponse {
  status: string;
  statusCode: number;
  message?: string;
  statusMessage?: string;
  data: {
    token: string;
    refreshToken: string;
    type: string;
    userId: number;
    employeeId: number | null;
    companyStaffId: number | null;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    roles: string[];
    globalPermissions: string[];
    projectAccessList: any[];
  };
}

class AuthService {
  static async login(email: string, password?: string): Promise<LoginResponse> {
    this.clearAuthData();

    const response = await apiClient.post(ENDPOINTS.login, {
      email: email.trim().toLowerCase(),
      password: password || '',
    });

    const envelope = response.data;
    const payload = envelope?.data;

    if (!payload || !payload.token) {
      throw new Error(envelope?.message || 'Login failed: missing token in response');
    }

    localStorage.setItem('authToken', payload.token);
    if (payload.refreshToken) {
      localStorage.setItem('refreshToken', payload.refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(payload));

    return {
      status: envelope.status || 'success',
      statusCode: envelope.statusCode || 200,
      message: envelope.message || 'Login successful',
      statusMessage: envelope.message || 'Login successful',
      data: payload,
    };
  }

  static async changePassword(_currentPassword?: string, _newPassword?: string, _confirmPassword?: string): Promise<void> {
    return Promise.resolve();
  }

  static async logout(): Promise<void> {
    this.clearAuthData();
  }

  static clearAuthData(): void {
    tokenManager.clearAuthData();
  }

  static logoutImmediate(): void {
    this.clearAuthData();
  }

  static isAuthenticated(): boolean {
    const token = tokenManager.getToken();
    return token !== null && token.length > 0 && tokenManager.isTokenValid();
  }

  static getCurrentUser(): any | null {
    const token = tokenManager.getToken();
    if (!token || !tokenManager.isTokenValid()) {
      return null;
    }
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  static getToken(): string | null {
    return tokenManager.getToken();
  }
}

export default AuthService;