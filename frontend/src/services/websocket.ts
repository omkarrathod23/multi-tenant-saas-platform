import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface WebSocketNotification {
  type: string;
  title?: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  timestamp: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  onlineUsers: number;
  growthRate?: number;
  timestamp: string;
}

export interface UserStatusUpdate {
  userId: number;
  status: 'ONLINE' | 'OFFLINE';
  timestamp: string;
}

type Callback<T> = (data: T) => void;

class WebSocketService {
  private client: Client | null = null;
  private connected = false;

  private notificationCbs = new Set<Callback<WebSocketNotification>>();
  private metricsCbs = new Set<Callback<DashboardMetrics>>();
  private statusCbs = new Set<Callback<UserStatusUpdate>>();

  connect(token: string, tenantId: number): void {
    if (this.client?.active) return;

    let wsUrl = import.meta.env.VITE_WS_URL;
    
    // If no URL is provided, derive it from the current location (same host)
    if (!wsUrl) {
      const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
      const host = window.location.hostname === 'localhost' ? 'localhost:8080' : window.location.host;
      wsUrl = `${protocol}//${host}/ws`;
    }

    console.log('🔌 Connecting to WebSocket at:', wsUrl);

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${wsUrl}?token=${token}`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (msg: string) => {
        if (import.meta.env.DEV) {
          console.log('[STOMP]', msg);
        }
      },

      onConnect: () => {
        console.log('✅ WebSocket connected');
        this.connected = true;
        this.subscribe(tenantId);
      },

      onWebSocketClose: () => {
        console.log('❌ WebSocket disconnected');
        this.connected = false;
      },

      onStompError: (frame: any) => {
        console.error('❌ STOMP error', frame);
      }
    });

    this.client.activate();
  }

  private subscribe(tenantId: number) {
    if (!this.client) return;

    this.client.subscribe(`/topic/tenant/${tenantId}/notifications`, msg =>
      this.notificationCbs.forEach(cb => cb(JSON.parse(msg.body)))
    );

    this.client.subscribe(`/topic/tenant/${tenantId}/metrics`, msg =>
      this.metricsCbs.forEach(cb => cb(JSON.parse(msg.body)))
    );

    this.client.subscribe(`/topic/tenant/${tenantId}/users/status`, msg =>
      this.statusCbs.forEach(cb => cb(JSON.parse(msg.body)))
    );
  }

  disconnect() {
    this.client?.deactivate();
    this.client = null;
    this.connected = false;
  }

  onNotification(cb: Callback<WebSocketNotification>) {
    this.notificationCbs.add(cb);
    return () => { this.notificationCbs.delete(cb); };
  }

  onMetrics(cb: Callback<DashboardMetrics>) {
    this.metricsCbs.add(cb);
    return () => { this.metricsCbs.delete(cb); };
  }

  onUserStatus(cb: Callback<UserStatusUpdate>) {
    this.statusCbs.add(cb);
    return () => { this.statusCbs.delete(cb); };
  }

  isConnected() {
    return this.connected;
  }
}

export default new WebSocketService();
