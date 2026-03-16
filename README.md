# Multi-Tenant SaaS Application

A production-ready, enterprise-grade multi-tenant SaaS application built with Spring Boot 3, React, TypeScript, and PostgreSQL. Features schema-based multi-tenancy, JWT authentication, role-based access control, and complete data isolation.

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.2.0
- Spring Security 6
- JWT Authentication
- Hibernate/JPA
- PostgreSQL
- Maven

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Axios
- React Router
- Vite

**DevOps:**
- Docker & Docker Compose
- Multi-stage builds
- Nginx for frontend serving

### Multi-Tenancy Strategy

- **Schema-based Multi-Tenancy**: Each tenant has its own database schema
- **Tenant Resolution**: Via HTTP header `X-TENANT-ID`
- **Data Isolation**: Complete separation at the database level
- **Master Schema**: Global tenant data stored in `master` schema

## 📋 Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ BCrypt password encryption
- ✅ Role-based access control (SUPER_ADMIN, TENANT_ADMIN, USER)
- ✅ Protected routes and API endpoints

### Multi-Tenancy
- ✅ Schema-based tenant isolation
- ✅ Automatic schema creation on tenant registration
- ✅ Tenant context management
- ✅ Header-based tenant resolution

### Tenant Management
- ✅ Create, read, update, delete tenants
- ✅ Subscription plans (FREE, PRO)
- ✅ Tenant status management
- ✅ SUPER_ADMIN only access

### User Management
- ✅ Per-tenant user management
- ✅ User CRUD operations
- ✅ Role assignment
- ✅ Tenant-specific user isolation

### Frontend Dashboard
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Login and registration pages
- ✅ Tenant dashboard
- ✅ User management interface
- ✅ Tenant management interface (SUPER_ADMIN only)
- ✅ JWT token handling
- ✅ Automatic API calls with tenant context

## 🚀 Quick Start

### Prerequisites

- Java 17+
- Maven 3.6+
- Node.js 18+
- Docker & Docker Compose (optional)
- PostgreSQL 15+ (if running without Docker)

### Local Development Setup

#### 1. Database Setup

```bash
# Create PostgreSQL database
createdb saas_db

# Or using Docker
docker run --name saas-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=saas_db -p 5432:5432 -d postgres:15-alpine
```

#### 2. Backend Setup

```bash
cd backend

# Update application.yml with your database credentials if needed

# Build and run
mvn clean install
mvn spring-boot:run

# Backend will run on http://localhost:8080
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will run on http://localhost:3000
```

### Docker Setup (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- PostgreSQL: localhost:5432

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "tenantId": "1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "tenantId": 1
  },
  "timestamp": "2024-01-01T12:00:00"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "tenantId": "1"
}
```

**Response:** Same as register response

### Tenant Management Endpoints (SUPER_ADMIN only)

#### Get All Tenants
```http
GET /api/tenants
Authorization: Bearer <token>
```

#### Create Tenant
```http
POST /api/tenants
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Acme Corp",
  "subscriptionPlan": "PRO"
}
```

#### Update Tenant
```http
PUT /api/tenants/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Acme Corp Updated",
  "subscriptionPlan": "PRO"
}
```

#### Delete Tenant
```http
DELETE /api/tenants/{id}
Authorization: Bearer <token>
```

### User Management Endpoints

#### Get All Users (TENANT_ADMIN, SUPER_ADMIN)
```http
GET /api/users
Authorization: Bearer <token>
X-TENANT-ID: 1
```

#### Create User (TENANT_ADMIN, SUPER_ADMIN)
```http
POST /api/users
Authorization: Bearer <token>
X-TENANT-ID: 1
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "USER"
}
```

#### Update User (TENANT_ADMIN, SUPER_ADMIN)
```http
PUT /api/users/{id}
Authorization: Bearer <token>
X-TENANT-ID: 1
Content-Type: application/json

{
  "email": "updated@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "TENANT_ADMIN"
}
```

#### Delete User (TENANT_ADMIN, SUPER_ADMIN)
```http
DELETE /api/users/{id}
Authorization: Bearer <token>
X-TENANT-ID: 1
```

## 🔐 Security

### JWT Configuration
- Token expiration: 24 hours
- Secret key: Configure via `JWT_SECRET` environment variable
- Algorithm: HS256

### Password Security
- BCrypt encryption with strength 10
- Minimum password length: 6 characters

### Role Hierarchy
1. **USER**: Basic access, view own profile
2. **TENANT_ADMIN**: Manage users within tenant
3. **SUPER_ADMIN**: Full system access, manage tenants

## 🗄️ Database Schema

### Master Schema (Global)
- `tenants` table: Stores all tenant information

### Tenant Schemas (Per Tenant)
- `users` table: Tenant-specific users

### Schema Creation
Tenant schemas are automatically created when a new tenant is registered via the API.

## 🧪 Testing the Application

### 1. Create a Tenant (as SUPER_ADMIN)

First, you'll need to manually create a SUPER_ADMIN user in the database or use a seed script. For testing:

```sql
-- Connect to master schema
SET search_path TO master;

-- Insert a tenant
INSERT INTO master.tenants (name, schema, subscription_plan, active, created_at, updated_at)
VALUES ('Test Tenant', 'test_tenant', 'FREE', true, NOW(), NOW());

-- Create the tenant schema
CREATE SCHEMA IF NOT EXISTS test_tenant;

-- Create users table in tenant schema
CREATE TABLE IF NOT EXISTS test_tenant.users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    tenant_id BIGINT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Create a SUPER_ADMIN user (password: admin123)
-- Password hash for 'admin123' using BCrypt
INSERT INTO test_tenant.users (email, password, first_name, last_name, role, tenant_id, active, created_at, updated_at)
VALUES (
    'admin@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Admin',
    'User',
    'SUPER_ADMIN',
    1,
    true,
    NOW(),
    NOW()
);
```

### 2. Login
- Email: `admin@test.com`
- Password: `admin123`
- Tenant ID: `1`

### 3. Create Additional Tenants
Use the tenant management interface (SUPER_ADMIN only).

### 4. Register Users
Use the registration page with the appropriate tenant ID.

## 🚢 Deployment

### AWS EC2 Deployment

#### 1. Launch EC2 Instance
- Instance type: t3.medium or larger
- OS: Ubuntu 22.04 LTS
- Security groups: Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 8080 (Backend)

#### 2. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 17
sudo apt install openjdk-17-jdk -y

# Install Maven
sudo apt install maven -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 3. Clone and Deploy

```bash
# Clone repository
git clone <your-repo-url>
cd multi-tenant-saas

# Set environment variables
export DB_USERNAME=postgres
export DB_PASSWORD=your-secure-password
export JWT_SECRET=your-256-bit-secret-key-minimum-32-characters

# Build and start with Docker Compose
docker-compose up -d --build
```

#### 4. Configure Nginx Reverse Proxy (Optional)

```bash
# Install Nginx
sudo apt install nginx -y

# Create configuration
sudo nano /etc/nginx/sites-available/saas-app
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/saas-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Set Up SSL with Let's Encrypt (Optional)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## 📝 Environment Variables

### Backend
- `DB_USERNAME`: PostgreSQL username (default: postgres)
- `DB_PASSWORD`: PostgreSQL password (default: postgres)
- `JWT_SECRET`: JWT signing secret (minimum 32 characters)
- `SPRING_DATASOURCE_URL`: Database connection URL

### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:8080/api)

## 🏗️ Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/saas/
│   │   │   │   ├── config/          # Multi-tenancy & security config
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── dto/             # Data transfer objects
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── exception/       # Exception handlers
│   │   │   │   ├── repository/      # JPA repositories
│   │   │   │   ├── security/        # Security configuration
│   │   │   │   ├── service/         # Business logic
│   │   │   │   └── util/            # Utilities (JWT)
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── schema.sql
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/          # React context (Auth)
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔧 Troubleshooting

### Backend Issues

**Problem:** Multi-tenancy not working
- **Solution:** Ensure `X-TENANT-ID` header is set in requests
- Check tenant schema exists in database
- Verify `TenantContext` is properly set

**Problem:** JWT token invalid
- **Solution:** Check `JWT_SECRET` is set correctly
- Verify token expiration time
- Ensure token is sent in `Authorization: Bearer <token>` header

### Frontend Issues

**Problem:** API calls failing
- **Solution:** Check `VITE_API_URL` environment variable
- Verify backend is running on correct port
- Check CORS configuration in `SecurityConfig`

**Problem:** Tenant ID not being sent
- **Solution:** Ensure user is logged in and `tenantId` is stored in localStorage
- Check API service interceptors

### Database Issues

**Problem:** Schema not found
- **Solution:** Ensure tenant schema exists
- Run schema creation manually if needed
- Check tenant registration process

## 📄 License

This project is provided as-is for educational and portfolio purposes.

## 🤝 Contributing

This is a production-ready template. Feel free to fork and customize for your needs.

## 📧 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ for enterprise-grade multi-tenant SaaS applications**

