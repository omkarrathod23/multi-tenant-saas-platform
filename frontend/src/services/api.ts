import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ✅ Attach JWT + Tenant automatically
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token");
        const tenantId = localStorage.getItem("tenantId");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (tenantId) {
          config.headers["X-Tenant-Id"] = tenantId;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Global 401 handler
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("tenantId");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // 🔐 LOGIN
  async login(data: { email: string; password: string; tenantId?: string | number }) {
    const payload = {
      email: data.email,
      password: data.password,
      tenantId: data.tenantId || localStorage.getItem("tenantId") || "3",
    };
    const res = await this.api.post("/auth/login", payload);

    if (res.data?.data?.token) {
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("tenantId", res.data.data.tenantId);
      localStorage.setItem("user", JSON.stringify(res.data.data));
    }

    return res.data;
  }

  // 📝 REGISTER
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    tenantId?: number | string;
  }) {
    const payload = {
      ...data,
      tenantId: data.tenantId || localStorage.getItem("tenantId") || "1",
    };
    const res = await this.api.post("/auth/register", payload);

    if (res.data?.data?.token) {
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("tenantId", res.data.data.tenantId);
      localStorage.setItem("user", JSON.stringify(res.data.data));
    }

    return res.data;
  }

  // 🤖 AI CHAT
  async chat(message: string): Promise<{ reply: string }> {
    const res = await this.api.post("/ai/chat", { message });
    return res.data;
  }

  // 📋 AUDIT LOGS
  async getAuditLogs(page = 0, size = 20, filters?: any) {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    if (filters?.userEmail) params.append("userEmail", filters.userEmail);
    if (filters?.actionType) params.append("actionType", filters.actionType);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    const res = await this.api.get(`/audit/logs?${params}`);
    return res.data;
  }

  async getAuditLogsByUser(userEmail: string, page = 0, size = 20) {
    const res = await this.api.get(`/audit/logs/user/${userEmail}?page=${page}&size=${size}`);
    return res.data;
  }

  async getAuditLogsByActionType(actionType: string, page = 0, size = 20) {
    const res = await this.api.get(`/audit/logs/action/${actionType}?page=${page}&size=${size}`);
    return res.data;
  }

  async getFailedOperations(page = 0, size = 20) {
    const res = await this.api.get(`/audit/logs/failures?page=${page}&size=${size}`);
    return res.data;
  }

  async getEntityHistory(entityId: string) {
    const res = await this.api.get(`/audit/logs/entity/${entityId}`);
    return res.data;
  }

  async getMyRecentActivities() {
    const res = await this.api.get("/audit/my-activities");
    return res.data;
  }

  async getAuditSummary(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const res = await this.api.get(`/audit/summary?${params}`);
    return res.data;
  }

  // 👥 USERS
  async getUsers() {
    const res = await this.api.get("/users");
    return res.data;
  }

  async createUser(data: any) {
    const res = await this.api.post("/users", data);
    return res.data;
  }

  async updateUser(id: number, data: any) {
    const res = await this.api.put(`/users/${id}`, data);
    return res.data;
  }

  async deleteUser(id: number | string) {
    const res = await this.api.delete(`/users/${id}`);
    return res.data;
  }

  // 🏢 TENANTS
  async getTenants() {
    const res = await this.api.get("/tenants");
    return res.data;
  }

  async getTenantById(id: number | string) {
    const res = await this.api.get(`/tenants/${id}`);
    return res.data;
  }

  async createTenant(data: any) {
    const res = await this.api.post("/tenants", data);
    return res.data;
  }

  async updateTenant(id: number | string, data: any) {
    const res = await this.api.put(`/tenants/${id}`, data);
    return res.data;
  }

  async deleteTenant(id: number | string) {
    const res = await this.api.delete(`/tenants/${id}`);
    return res.data;
  }

  // 🚪 LOGOUT
  logout() {
    localStorage.clear();
    window.location.href = "/login";
  }
}

export default new ApiService();
