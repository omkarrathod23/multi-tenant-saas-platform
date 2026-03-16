import React from "react";
import { AuditLog } from "@/types/audit";
import { formatDistanceToNow } from "date-fns";
import {
  LogIn,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Shield,
  CheckCircle,
  AlertCircle,
  User,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuditTimelineProps {
  logs: AuditLog[];
  loading?: boolean;
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  LOGIN: <LogIn className="w-4 h-4" />,
  LOGOUT: <LogOut className="w-4 h-4" />,
  CREATE: <Plus className="w-4 h-4" />,
  UPDATE: <Edit className="w-4 h-4" />,
  DELETE: <Trash2 className="w-4 h-4" />,
  ROLE_CHANGE: <Shield className="w-4 h-4" />,
};

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "bg-green-500",
  LOGOUT: "bg-blue-500",
  CREATE: "bg-emerald-500",
  UPDATE: "bg-amber-500",
  DELETE: "bg-red-500",
  ROLE_CHANGE: "bg-purple-500",
  OTHER: "bg-gray-500",
};

const ENTITY_COLORS: Record<string, string> = {
  USER: "bg-blue-100 text-blue-800",
  TENANT: "bg-purple-100 text-purple-800",
  ROLE: "bg-indigo-100 text-indigo-800",
  PERMISSION: "bg-violet-100 text-violet-800",
  CHAT_MESSAGE: "bg-cyan-100 text-cyan-800",
  OTHER: "bg-gray-100 text-gray-800",
};

export default function AuditTimeline({
  logs,
  loading = false,
}: AuditTimelineProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No audit logs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log, index) => (
        <div
          key={log.id}
          className="relative flex gap-4 pb-8 last:pb-0"
        >
          {/* Timeline line */}
          {index < logs.length - 1 && (
            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
          )}

          {/* Timeline dot */}
          <div
            className={`relative flex items-center justify-center w-12 h-12 rounded-full ${
              ACTION_COLORS[log.actionType] || ACTION_COLORS.OTHER
            } text-white flex-shrink-0 shadow-md`}
          >
            {log.status === "FAILURE" ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              ACTION_ICONS[log.actionType] || "•"
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pt-2">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-semibold text-sm">
                  {log.actionType.replace(/_/g, " ")}
                </h4>
                <p className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                  <User className="w-3 h-3" />
                  {log.userEmail}
                </p>
              </div>

              {/* Status Badge */}
              <Badge
                variant="outline"
                className={`text-xs ${
                  log.status === "SUCCESS"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {log.status === "SUCCESS" ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Success
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Failed
                  </>
                )}
              </Badge>
            </div>

            {/* Entity Info */}
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge
                className={`text-xs font-medium ${
                  ENTITY_COLORS[log.entityType] ||
                  ENTITY_COLORS.OTHER
                }`}
                variant="secondary"
              >
                {log.entityType}
              </Badge>
              {log.entityName && (
                <Badge variant="outline" className="text-xs">
                  {log.entityName}
                </Badge>
              )}
            </div>

            {/* Details */}
            {log.details && (
              <p className="text-sm text-gray-700 mt-2">{log.details}</p>
            )}

            {/* Changes (if any) */}
            {(log.oldValue || log.newValue) && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs space-y-1">
                {log.oldValue && (
                  <div>
                    <span className="font-medium text-gray-600">Old:</span>{" "}
                    <span className="text-red-600">{log.oldValue}</span>
                  </div>
                )}
                {log.newValue && (
                  <div>
                    <span className="font-medium text-gray-600">New:</span>{" "}
                    <span className="text-green-600">{log.newValue}</span>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {log.errorMessage && (
              <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                <strong>Error:</strong> {log.errorMessage}
              </div>
            )}

            {/* Footer: Time & IP */}
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <span>
                {formatDistanceToNow(new Date(log.createdAt), {
                  addSuffix: true,
                })}
              </span>
              {log.ipAddress && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {log.ipAddress}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
