import React, { useEffect, useState } from 'react';
import { Circle } from 'lucide-react';
import websocketService, { UserStatusUpdate } from '@/services/websocket';
import { useAuth } from '@/context/AuthContext';

const UserStatusIndicator: React.FC<{ userId: number }> = ({ userId }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<'ONLINE' | 'OFFLINE' | 'AWAY'>('OFFLINE');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check WebSocket connection status
    const wsConnected = websocketService.isConnected();
    setIsConnected(wsConnected);

    // Subscribe to user status updates
    const unsubscribe = websocketService.onUserStatus((statusUpdate: UserStatusUpdate) => {
      if (statusUpdate.userId === userId) {
        setStatus(statusUpdate.status as 'ONLINE' | 'OFFLINE' | 'AWAY');
      }
    });

    // If WebSocket is connected, assume user is online
    if (wsConnected) {
      setStatus('ONLINE');
    }

    return unsubscribe;
  }, [userId]);

  const getStatusColor = () => {
    switch (status) {
      case 'ONLINE':
        return 'text-green-500 fill-green-500';
      case 'AWAY':
        return 'text-yellow-500 fill-yellow-500';
      case 'OFFLINE':
        return 'text-slate-400 fill-slate-400';
      default:
        return 'text-slate-400 fill-slate-400';
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <Circle className={`h-2 w-2 ${getStatusColor()}`} />
      <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">{status.toLowerCase()}</span>
    </div>
  );
};

export default UserStatusIndicator;

