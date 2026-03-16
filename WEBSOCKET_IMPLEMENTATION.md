# Real-Time WebSocket Implementation with Spring WebSocket and STOMP

## Overview

This implementation adds real-time functionality to the multi-tenant SaaS application using Spring WebSocket with STOMP protocol, providing:

- **Live notifications** (user actions, system alerts)
- **Real-time dashboard metric updates**
- **Online/offline user status tracking**
- **Tenant-isolated WebSocket channels**
- **Secure WebSocket connections with JWT authentication**
- **Frontend real-time UI updates**

## Architecture

### Backend Components

#### 1. **WebSocket Configuration** (`WebSocketConfig.java`)
- Enables STOMP over WebSocket
- Configures message broker with `/topic` and `/queue` destinations
- Sets up application destination prefix `/app`
- Registers STOMP endpoint at `/ws`

#### 2. **WebSocket Authentication** (`WebSocketAuthInterceptor.java`)
- Validates JWT tokens during WebSocket handshake
- Extracts user and tenant information from JWT
- Sets tenant context for multi-tenant isolation
- Implements `HandshakeInterceptor` and `ChannelInterceptor`

#### 3. **Event Publisher Service** (`WebSocketEventPublisher.java`)
- Publishes notifications to tenant-specific channels: `/topic/tenant/{tenantId}/notifications`
- Publishes user-specific notifications: `/user/{email}/queue/notifications`
- Publishes metrics updates: `/topic/tenant/{tenantId}/metrics`
- Publishes user status updates: `/topic/tenant/{tenantId}/users/status`

#### 4. **User Status Service** (`UserStatusService.java`)
- Tracks online/offline user status per tenant
- Manages user sessions
- Publishes status updates when users connect/disconnect

#### 5. **WebSocket Controller** (`WebSocketController.java`)
- Handles subscription requests
- Listens to connection/disconnection events
- Manages user status updates

#### 6. **DTOs**
- `WebSocketNotification`: Notifications with type, severity, metadata
- `DashboardMetrics`: Real-time dashboard metrics (users, growth, performance)
- `UserStatusUpdate`: User online/offline status updates

### Frontend Components

#### 1. **WebSocket Service** (`services/websocket.ts`)
- STOMP client implementation using `@stomp/stompjs` and `sockjs-client`
- Automatic reconnection with exponential backoff
- JWT authentication on connection
- Subscription management for notifications, metrics, and user status
- Type-safe interfaces for all message types

#### 2. **Notification Center** (`components/NotificationCenter.tsx`)
- Real-time notification display with severity indicators
- Toast notifications for new messages
- Unread count badge
- Mark as read functionality
- Severity-based styling (INFO, WARNING, ERROR, SUCCESS)

#### 3. **User Status Indicator** (`components/UserStatusIndicator.tsx`)
- Displays online/offline status with visual indicators
- Subscribes to user status updates

#### 4. **Dashboard Integration** (`pages/Dashboard.tsx`)
- Real-time metrics updates via WebSocket
- Automatic refresh when metrics change
- Seamless integration with existing dashboard

## WebSocket Channels

### Tenant-Specific Channels
- `/topic/tenant/{tenantId}/notifications` - Tenant-wide notifications
- `/topic/tenant/{tenantId}/metrics` - Dashboard metrics updates
- `/topic/tenant/{tenantId}/users/status` - User status changes

### User-Specific Channels
- `/user/{email}/queue/notifications` - Personal notifications

## Security

1. **JWT Authentication**: All WebSocket connections require valid JWT token
2. **Tenant Isolation**: Each tenant has isolated channels
3. **Authorization**: Token validation in handshake and message interceptors
4. **CORS**: Configured in `WebSocketConfig` (update allowed origins for production)

## Usage Examples

### Publishing a Notification from Backend

```java
@Autowired
private WebSocketEventPublisher eventPublisher;

// Tenant-wide notification
eventPublisher.publishNotification(tenantId, new WebSocketNotification(
    "USER_ACTION",
    "User Created",
    "A new user has been registered",
    "INFO"
));

// User-specific notification
eventPublisher.publishUserNotification(userEmail, new WebSocketNotification(
    "ALERT",
    "System Maintenance",
    "Scheduled maintenance in 30 minutes",
    "WARNING"
));

// System alert
eventPublisher.publishSystemAlert(tenantId, "Alert", "System update completed", "SUCCESS");
```

### Publishing Metrics Updates

```java
DashboardMetrics metrics = new DashboardMetrics(
    tenantId,
    totalUsers,
    activeUsers,
    onlineUsers,
    growthRate,
    performance
);
eventPublisher.publishMetricsUpdate(tenantId, metrics);
```

### Frontend Usage

The WebSocket service automatically connects on login (via `AuthContext`). Components can subscribe to updates:

```typescript
// Subscribe to notifications
const unsubscribe = websocketService.onNotification((notification) => {
  console.log('New notification:', notification);
});

// Subscribe to metrics
websocketService.onMetrics((metrics) => {
  updateDashboard(metrics);
});

// Cleanup
return () => unsubscribe();
```

## Configuration

### Backend (`application.yml`)
No additional configuration required. WebSocket uses existing JWT and tenant settings.

### Frontend (`.env`)
Optional environment variable:
```
VITE_WS_URL=http://localhost:8080/ws
```

## Dependencies

### Backend
- `spring-boot-starter-websocket` (added to `pom.xml`)

### Frontend
- `@stomp/stompjs` - STOMP client
- `sockjs-client` - SockJS client for fallback support

## Testing

1. **Start the application**
2. **Login** - WebSocket connection is established automatically
3. **Trigger events** - Create/update users, metrics changes will appear in real-time
4. **Check notifications** - Click the bell icon in the navbar
5. **Monitor user status** - User status updates when users connect/disconnect

## Production Considerations

1. **Allowed Origins**: Update `setAllowedOriginPatterns("*")` in `WebSocketConfig` to specific domains
2. **Message Broker**: Consider using RabbitMQ or ActiveMQ for production instead of in-memory broker
3. **Connection Limits**: Implement connection rate limiting
4. **Monitoring**: Add metrics for WebSocket connections and message throughput
5. **Error Handling**: Enhance error handling and logging for production

## Troubleshooting

- **Connection fails**: Check JWT token validity and tenant ID
- **No messages received**: Verify subscription destinations match backend publish destinations
- **CORS errors**: Check allowed origins in `WebSocketConfig`
- **Reconnection issues**: Check network connectivity and WebSocket endpoint availability

