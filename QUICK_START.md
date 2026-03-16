# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd multi-tenant-saas

# 2. Create .env file (optional, uses defaults if not provided)
cp .env.example .env
# Edit .env with your values

# 3. Start all services
docker-compose up --build

# 4. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

### Option 2: Local Development

#### Backend

```bash
cd backend

# Install dependencies and build
mvn clean install

# Run application
mvn spring-boot:run

# Backend runs on http://localhost:8080
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend runs on http://localhost:3000
```

## 📝 First Steps

### 1. Create a Tenant (Manual)

Since you need a tenant to register users, first create one manually in the database:

```sql
-- Connect to PostgreSQL
psql -U postgres -d saas_db

-- Create master schema if not exists
CREATE SCHEMA IF NOT EXISTS master;

-- Create tenants table if not exists
CREATE TABLE IF NOT EXISTS master.tenants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    schema VARCHAR(255) NOT NULL UNIQUE,
    subscription_plan VARCHAR(50) NOT NULL DEFAULT 'FREE',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Insert a test tenant
INSERT INTO master.tenants (name, schema, subscription_plan, active, created_at, updated_at)
VALUES ('Test Company', 'test_company', 'FREE', true, NOW(), NOW());

-- Create tenant schema
CREATE SCHEMA IF NOT EXISTS test_company;

-- Create users table in tenant schema
CREATE TABLE IF NOT EXISTS test_company.users (
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

-- Note: Get the tenant ID from the INSERT above (usually 1)
-- You'll need this ID for registration/login
```

### 2. Register Your First User

1. Open http://localhost:3000/register
2. Fill in the form:
   - **Tenant ID**: `1` (or the ID from step 1)
   - **First Name**: Your first name
   - **Last Name**: Your last name
   - **Email**: your-email@example.com
   - **Password**: (minimum 6 characters)
3. Click "Create account"
4. You'll be automatically logged in

### 3. Login

1. Open http://localhost:3000/login
2. Enter:
   - **Tenant ID**: `1`
   - **Email**: your-email@example.com
   - **Password**: your password
3. Click "Sign in"

### 4. Create a SUPER_ADMIN User (Optional)

To access tenant management, you need a SUPER_ADMIN user. Create one manually:

```sql
-- Connect to your tenant schema
SET search_path TO test_company;

-- Insert SUPER_ADMIN user
-- Password: admin123 (BCrypt hash)
INSERT INTO test_company.users (email, password, first_name, last_name, role, tenant_id, active, created_at, updated_at)
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

Login with:
- Tenant ID: `1`
- Email: `admin@test.com`
- Password: `admin123`

## 🎯 Common Tasks

### Create a New Tenant (SUPER_ADMIN only)

1. Login as SUPER_ADMIN
2. Navigate to "Tenant Management" from dashboard
3. Click "Add Tenant"
4. Fill in tenant name and subscription plan
5. Click "Create"

### Create a New User (TENANT_ADMIN or SUPER_ADMIN)

1. Login as TENANT_ADMIN or SUPER_ADMIN
2. Navigate to "User Management" from dashboard
3. Click "Add User"
4. Fill in user details
5. Click "Create"

### Update User Role

1. Go to User Management
2. Click "Edit" on a user
3. Change the role dropdown
4. Click "Update"

## 🔧 Troubleshooting

### Backend won't start

```bash
# Check if PostgreSQL is running
docker-compose ps

# Check backend logs
docker-compose logs backend

# Or if running locally
mvn spring-boot:run
```

### Frontend won't connect to backend

1. Check backend is running on http://localhost:8080
2. Check CORS settings in `SecurityConfig.java`
3. Verify `VITE_API_URL` in frontend `.env` or `vite.config.ts`

### Database connection errors

1. Verify PostgreSQL is running
2. Check database credentials in `application.yml`
3. Ensure database `saas_db` exists
4. Check connection string format

### Multi-tenancy not working

1. Ensure `X-TENANT-ID` header is being sent
2. Verify tenant schema exists in database
3. Check `TenantContext` is being set correctly
4. Review backend logs for errors

## 📚 Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## 💡 Tips

1. **Development**: Use Docker Compose for easy setup
2. **Testing**: Use Postman or curl to test APIs directly
3. **Database**: Use pgAdmin or DBeaver for database management
4. **Logs**: Check Docker logs with `docker-compose logs -f`
5. **Hot Reload**: Frontend has hot reload, backend requires restart

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review the full README.md
3. Check application logs
4. Verify all services are running

---

**Happy Coding! 🎉**

