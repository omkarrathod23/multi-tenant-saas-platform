# Project Structure

## Overview

This is a complete multi-tenant SaaS application with clear separation between backend and frontend.

```
multi-tenant-saas/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/saas/
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   │   ├── TenantContext.java
│   │   │   │   │   ├── TenantInterceptor.java
│   │   │   │   │   ├── TenantIdentifierResolver.java
│   │   │   │   │   ├── TenantConnectionProvider.java
│   │   │   │   │   └── WebConfig.java
│   │   │   │   ├── controller/      # REST Controllers
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── TenantController.java
│   │   │   │   │   └── UserController.java
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   │   ├── ApiResponse.java
│   │   │   │   │   ├── AuthResponse.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   ├── TenantRequest.java
│   │   │   │   │   ├── TenantResponse.java
│   │   │   │   │   ├── UserRequest.java
│   │   │   │   │   └── UserResponse.java
│   │   │   │   ├── entity/           # JPA Entities
│   │   │   │   │   ├── Role.java (enum)
│   │   │   │   │   ├── SubscriptionPlan.java (enum)
│   │   │   │   │   ├── Tenant.java
│   │   │   │   │   └── User.java
│   │   │   │   ├── exception/        # Exception Handling
│   │   │   │   │   └── GlobalExceptionHandler.java
│   │   │   │   ├── repository/       # JPA Repositories
│   │   │   │   │   ├── TenantRepository.java
│   │   │   │   │   └── UserRepository.java
│   │   │   │   ├── security/          # Security Configuration
│   │   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   │   └── SecurityConfig.java
│   │   │   │   ├── service/           # Business Logic
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── TenantService.java
│   │   │   │   │   └── UserService.java
│   │   │   │   ├── util/              # Utilities
│   │   │   │   │   └── JwtUtil.java
│   │   │   │   └── MultiTenantSaaSApplication.java
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── application-docker.yml
│   │   │       └── schema.sql
│   │   └── test/                      # Test files (to be added)
│   ├── Dockerfile
│   ├── pom.xml
│   └── .gitignore
│
├── frontend/                  # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/        # React Components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── pages/             # Page Components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   └── TenantManagement.tsx
│   │   ├── services/          # API Services
│   │   │   └── api.ts
│   │   ├── types/             # TypeScript Types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .gitignore
│
├── docker-compose.yml         # Docker Compose configuration
├── .env.example               # Environment variables template
├── README.md                  # Main documentation
├── API_DOCUMENTATION.md       # API reference
├── DEPLOYMENT.md              # Deployment guide
├── QUICK_START.md             # Quick start guide
└── PROJECT_STRUCTURE.md        # This file
```

## Backend Structure

### Configuration Layer (`config/`)
- **TenantContext**: Thread-local storage for current tenant
- **TenantInterceptor**: Extracts tenant ID from HTTP headers
- **TenantIdentifierResolver**: Hibernate resolver for tenant identification
- **TenantConnectionProvider**: Database connection provider with schema switching
- **WebConfig**: Web MVC configuration

### Controller Layer (`controller/`)
- **AuthController**: Authentication endpoints (login, register)
- **TenantController**: Tenant management (SUPER_ADMIN only)
- **UserController**: User management (TENANT_ADMIN, SUPER_ADMIN)

### Service Layer (`service/`)
- **AuthService**: Authentication business logic
- **TenantService**: Tenant management with schema creation
- **UserService**: User management per tenant

### Repository Layer (`repository/`)
- **TenantRepository**: JPA repository for tenants (master schema)
- **UserRepository**: JPA repository for users (tenant schemas)

### Entity Layer (`entity/`)
- **Tenant**: Tenant entity (stored in master schema)
- **User**: User entity (stored in tenant schemas)
- **Role**: Enum for user roles
- **SubscriptionPlan**: Enum for subscription plans

### DTO Layer (`dto/`)
- Request DTOs: LoginRequest, RegisterRequest, TenantRequest, UserRequest
- Response DTOs: AuthResponse, TenantResponse, UserResponse
- Common: ApiResponse wrapper

### Security Layer (`security/`)
- **SecurityConfig**: Spring Security configuration
- **JwtAuthenticationFilter**: JWT token validation filter

### Utilities (`util/`)
- **JwtUtil**: JWT token generation and validation

## Frontend Structure

### Pages (`pages/`)
- **Login**: User login page
- **Register**: User registration page
- **Dashboard**: Main dashboard after login
- **UserManagement**: User CRUD interface (TENANT_ADMIN+)
- **TenantManagement**: Tenant CRUD interface (SUPER_ADMIN only)

### Components (`components/`)
- **ProtectedRoute**: Route guard with role-based access

### Context (`context/`)
- **AuthContext**: Authentication state management

### Services (`services/`)
- **api.ts**: Axios-based API client with interceptors

### Types (`types/`)
- TypeScript interfaces for all data models

## Key Design Patterns

### Multi-Tenancy Pattern
- **Schema-based**: Each tenant has its own database schema
- **Header-based resolution**: Tenant ID from `X-TENANT-ID` header
- **Thread-local context**: Tenant context stored per request

### Security Pattern
- **JWT Authentication**: Stateless token-based auth
- **Role-based Access Control**: Three-tier role system
- **BCrypt Password Hashing**: Secure password storage

### Architecture Pattern
- **Layered Architecture**: Controller → Service → Repository
- **DTO Pattern**: Separate request/response objects
- **Exception Handling**: Global exception handler

## Database Schema

### Master Schema
- `tenants` table: Global tenant registry

### Tenant Schemas (per tenant)
- `users` table: Tenant-specific users

## API Design

### RESTful Principles
- Resource-based URLs
- HTTP methods for operations
- Standard status codes
- JSON request/response

### Authentication
- JWT tokens in Authorization header
- Tenant ID in X-TENANT-ID header

## Frontend Design

### State Management
- React Context for authentication
- Local state for component data
- LocalStorage for persistence

### Routing
- React Router for navigation
- Protected routes with role checks

### Styling
- Tailwind CSS for utility-first styling
- Responsive design
- Modern UI components

## Build & Deployment

### Backend
- Maven for dependency management
- Spring Boot Maven plugin for packaging
- Docker multi-stage build

### Frontend
- Vite for fast development and building
- TypeScript for type safety
- Nginx for production serving

### Docker
- Docker Compose for orchestration
- Separate containers for each service
- Volume persistence for database

## Testing Strategy (To Be Implemented)

### Backend
- Unit tests for services
- Integration tests for controllers
- Repository tests

### Frontend
- Component tests
- Integration tests
- E2E tests

## Security Considerations

### Implemented
- JWT authentication
- BCrypt password hashing
- Role-based access control
- CORS configuration
- SQL injection prevention (JPA)

### Recommended for Production
- Rate limiting
- Input sanitization
- HTTPS enforcement
- Security headers
- Audit logging
- Session management

## Scalability Considerations

### Current
- Stateless backend (JWT)
- Schema-based multi-tenancy
- Docker containerization

### Future Enhancements
- Horizontal scaling with load balancer
- Database connection pooling
- Caching layer (Redis)
- Message queue for async operations
- CDN for static assets

---

This structure follows industry best practices and is designed for maintainability and scalability.

