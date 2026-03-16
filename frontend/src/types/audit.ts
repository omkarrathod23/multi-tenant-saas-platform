// Audit Log types for frontend
export interface AuditLog {
  id: number;
  tenantId: string;
  userEmail: string;
  userId: string;
  actionType: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'ROLE_CHANGE' | 'OTHER';
  entityType: 'USER' | 'TENANT' | 'ROLE' | 'PERMISSION' | 'CHAT_MESSAGE' | 'OTHER';
  entityId: string;
  entityName: string;
  ipAddress: string;
  userAgent: string;
  oldValue?: string;
  newValue?: string;
  details: string;
  status: 'SUCCESS' | 'FAILURE';
  errorMessage?: string;
  createdAt: string;
}

export interface AuditSummary {
  totalActivities: number;
  successActivities: number;
  failedActivities: number;
  successRate: number;
  startDate: string;
  endDate: string;
}
