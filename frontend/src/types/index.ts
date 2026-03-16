export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER';
  tenantId: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: number;
  name: string;
  schema: string;
  subscriptionPlan: 'FREE' | 'PRO' | 'ENTERPRISE';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  tenantId: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: string;
}

export interface UserRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER';
}

export interface TenantRequest {
  name: string;
  subscriptionPlan: 'FREE' | 'PRO' | 'ENTERPRISE';
}

