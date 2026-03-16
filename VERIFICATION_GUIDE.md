# ✅ Audit Logging System - Verification & Testing Guide

## 🔍 Quick Status Check

### Status from Your Terminal Logs
- ✅ **Backend:** Running successfully (`mvn spring-boot:run` - Exit Code 0)
- ❌ **Frontend:** Build failed (`npm run dev` - Exit Code 1)
- ⏳ **Database:** Needs verification

---

## 🚀 Step 1: Fix Frontend Build Error

### Common Causes of `npm run dev` Exit Code 1

**First, check what the actual error is:**

```bash
cd frontend
npm run dev 2>&1 | tee build.log
```

This will show you the exact error and save it to `build.log`.

**Most likely issues:**

#### Issue 1: Missing Dependencies
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

#### Issue 2: TypeScript Errors
```bash
cd frontend
npm run build
```

If you see TypeScript errors, check for:
- Missing imports in `audit.ts`
- Component type mismatches
- File references to non-existent files

#### Issue 3: Port Already in Use (5173)
```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5173
kill -9 <PID>

# Then retry:
npm run dev
```

---

## ✅ Step 2: Verify Backend is Running

### Check Backend Health

```bash
# Test if backend is responding
curl http://localhost:8080/api/auth/health

# Expected response:
# {"status":"UP"}
```

If this fails, check:
```bash
# View backend logs
cd backend
mvn spring-boot:run 2>&1 | tail -50
```

### Key Backend Indicators

```bash
# 1. Check database connection
curl -X GET http://localhost:8080/actuator/health

# 2. Verify audit table exists
psql -U saas_user -d saas_db -c "SELECT COUNT(*) FROM audit_logs;"

# 3. Check if backend compiled
ls -la backend/target/*.jar
```

---

## ✅ Step 3: Verify Database Setup

### PostgreSQL Connection Check

```bash
# Connect to database
psql -U saas_user -d saas_db -h localhost

# Once connected, run:
\dt audit_logs          -- Check if table exists
\d audit_logs           -- Show table structure
\di public.idx_*        -- Show indexes

# Expected output:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'audit_logs';

-- Should return: audit_logs
```

### Quick Database Verification

```bash
# Check table exists and has data
psql -U saas_user -d saas_db -c "SELECT COUNT(*) as total, COUNT(DISTINCT tenant_id) as tenants FROM audit_logs;"

# Check indexes are present
psql -U saas_user -d saas_db -c "SELECT indexname FROM pg_indexes WHERE tablename = 'audit_logs' ORDER BY indexname;"

# Expected indexes:
# idx_action_type
# idx_created_at
# idx_entity_id
# idx_tenant_id
# idx_user_email
# audit_logs_pkey
```

---

## ✅ Step 4: Complete System Test (20 Minutes)

### Test 1: User Registration & Login

```bash
# 1. Register new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -H "X-TENANT-ID: tenant-test-1" \
  -d '{
    "email":"testuser@example.com",
    "password":"TestPassword123!",
    "name":"Test User"
  }'

# Expected Response:
# {"success":true,"data":{"id":"...","email":"testuser@example.com"},"message":"User registered successfully"}

# 2. Check if audit log was created
psql -U saas_user -d saas_db -c "SELECT * FROM audit_logs WHERE user_email = 'testuser@example.com' ORDER BY created_at DESC LIMIT 1;"

# Expected: One row with action_type = 'CREATE', status = 'SUCCESS'
```

### Test 2: Login & JWT Token

```bash
# 3. Login with new user
RESPONSE=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-TENANT-ID: tenant-test-1" \
  -d '{
    "email":"testuser@example.com",
    "password":"TestPassword123!"
  }')

echo $RESPONSE | jq '.data.token'  # Extract token

# Save token for next test:
TOKEN=$(echo $RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"

# 4. Check if LOGIN audit log was created
psql -U saas_user -d saas_db -c "SELECT action_type, status, ip_address FROM audit_logs WHERE user_email = 'testuser@example.com' AND action_type = 'LOGIN' ORDER BY created_at DESC LIMIT 1;"

# Expected: action_type = 'LOGIN', status = 'SUCCESS', ip_address = '127.0.0.1'
```

### Test 3: Get Audit Logs via API

```bash
# 5. Get all audit logs (using token from test 2)
curl -H "Authorization: Bearer $TOKEN" \
     -H "X-TENANT-ID: tenant-test-1" \
     http://localhost:8080/api/audit/logs?page=0&size=20

# Expected Response:
# {
#   "success": true,
#   "data": [
#     {
#       "id": 1,
#       "tenantId": "tenant-test-1",
#       "userEmail": "testuser@example.com",
#       "actionType": "LOGIN",
#       "status": "SUCCESS",
#       "createdAt": "2026-01-13T..."
#     }
#   ],
#   "totalElements": 2,
#   "totalPages": 1,
#   "currentPage": 0
# }
```

### Test 4: Frontend Access

```bash
# 6. Open in browser
http://localhost:5173/

# You should see:
# - Login page (if not authenticated)
# - After login: Dashboard page
# - Navigation menu with "Audit Logs" option (if admin)
```

### Test 5: Audit Logs Page (Admin Only)

```bash
# 7. Login as admin user
# Navigate to: http://localhost:5173/audit-logs

# You should see:
# ✅ Summary cards (Total, Success, Failed, Rate)
# ✅ Filter panel (email, action type, dates)
# ✅ Activity timeline
# ✅ Pagination controls

# Non-admin users should see: "Access Denied" message
```

---

## 🎯 Complete Verification Checklist

### Backend Verification

- [ ] Backend starts without errors (`mvn spring-boot:run`)
  ```bash
  # Check log for: "Started MultiTenantSaaSApplication in X seconds"
  ```

- [ ] Database connection works
  ```bash
  psql -U saas_user -d saas_db -c "SELECT 1;"
  ```

- [ ] audit_logs table exists
  ```bash
  psql -U saas_user -d saas_db -c "\dt audit_logs"
  ```

- [ ] All 5 indexes created
  ```bash
  psql -U saas_user -d saas_db -c "SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'audit_logs';"
  # Expected: 6 (5 custom + 1 primary key)
  ```

- [ ] Health endpoint responds
  ```bash
  curl http://localhost:8080/api/auth/health
  # Expected: {"status":"UP"}
  ```

### Authentication Verification

- [ ] User registration works
  ```bash
  curl -X POST http://localhost:8080/api/auth/register ...
  # Expected: 201 Created
  ```

- [ ] CREATE audit log created on registration
  ```bash
  psql -U saas_user -d saas_db -c "SELECT COUNT(*) FROM audit_logs WHERE action_type = 'CREATE';"
  # Expected: >= 1
  ```

- [ ] User login works
  ```bash
  curl -X POST http://localhost:8080/api/auth/login ...
  # Expected: JWT token returned
  ```

- [ ] LOGIN audit log created
  ```bash
  psql -U saas_user -d saas_db -c "SELECT COUNT(*) FROM audit_logs WHERE action_type = 'LOGIN';"
  # Expected: >= 1
  ```

### API Verification

- [ ] GET /api/audit/logs works
  ```bash
  curl -H "Authorization: Bearer $TOKEN" \
       http://localhost:8080/api/audit/logs
  # Expected: 200 OK with paginated results
  ```

- [ ] GET /api/audit/logs/failures works
  ```bash
  curl -H "Authorization: Bearer $TOKEN" \
       http://localhost:8080/api/audit/logs/failures
  # Expected: 200 OK
  ```

- [ ] GET /api/audit/summary works
  ```bash
  curl -H "Authorization: Bearer $TOKEN" \
       http://localhost:8080/api/audit/summary
  # Expected: 200 OK with stats
  ```

### Frontend Verification

- [ ] Frontend builds without errors
  ```bash
  cd frontend
  npm run build
  # Expected: "dist/index.html" appears in output
  ```

- [ ] Frontend dev server runs
  ```bash
  npm run dev
  # Expected: "Local: http://localhost:5173/"
  ```

- [ ] Login page accessible
  ```
  http://localhost:5173/login
  ```

- [ ] Can login and see dashboard
  ```
  http://localhost:5173/dashboard
  ```

- [ ] /audit-logs page works (admin only)
  ```
  http://localhost:5173/audit-logs
  # Expected: Audit dashboard with filters and timeline
  ```

### Multi-Tenant Verification

- [ ] Data isolated by tenant
  ```bash
  # Create 2 users with different tenants
  # Verify they only see their own logs
  psql -U saas_user -d saas_db -c \
    "SELECT DISTINCT tenant_id FROM audit_logs;"
  ```

- [ ] IP address captured
  ```bash
  psql -U saas_user -d saas_db -c \
    "SELECT ip_address FROM audit_logs LIMIT 1;"
  # Expected: Non-null IP like 127.0.0.1
  ```

---

## 🚨 Troubleshooting

### Problem: Frontend build fails with "npm run dev" exit 1

**Solution:**
```bash
cd frontend

# 1. Check error details
npm run dev 2>&1 | tee error.log

# 2. Install dependencies
npm install

# 3. Clear cache
rm -rf node_modules .next
npm install

# 4. Try again
npm run dev
```

### Problem: "audit_logs table not found"

**Solution:**
```bash
# 1. Ensure backend is running
cd backend
mvn spring-boot:run

# 2. Wait 5-10 seconds for Hibernate to create table

# 3. Check if table exists
psql -U saas_user -d saas_db -c "\dt audit_logs"

# 4. If still missing, manually create:
psql -U saas_user -d saas_db -c "
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- ... other fields
);
CREATE INDEX idx_tenant_id ON audit_logs(tenant_id);
"
```

### Problem: "Access Denied" on /audit-logs page

**Solution:**
```
1. Ensure user has TENANT_ADMIN role
2. Check JWT token is valid (not expired)
3. Verify X-TENANT-ID header matches
4. Try as different admin user
```

### Problem: No audit logs being created

**Solution:**
1. Check backend logs for errors
2. Verify AuditLogService is injected in AuthController
3. Check database connection
4. Look for exceptions in `AuditLogService.logActivity()`

---

## ✅ Quick Verification Script

Create file: `verify.sh`

```bash
#!/bin/bash

echo "=== AUDIT LOGGING SYSTEM VERIFICATION ==="
echo ""

# 1. Backend check
echo "1. Checking Backend..."
if curl -s http://localhost:8080/api/auth/health > /dev/null; then
    echo "   ✅ Backend running"
else
    echo "   ❌ Backend not responding"
    exit 1
fi

# 2. Database check
echo "2. Checking Database..."
if psql -U saas_user -d saas_db -c "\dt audit_logs" 2>/dev/null | grep -q audit_logs; then
    echo "   ✅ audit_logs table exists"
else
    echo "   ❌ audit_logs table not found"
    exit 1
fi

# 3. Indexes check
echo "3. Checking Indexes..."
INDEX_COUNT=$(psql -U saas_user -d saas_db -c "SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'audit_logs';" 2>/dev/null | tail -1)
echo "   ✅ Found $INDEX_COUNT indexes"

# 4. Audit log count
echo "4. Checking Audit Logs..."
LOG_COUNT=$(psql -U saas_user -d saas_db -c "SELECT COUNT(*) FROM audit_logs;" 2>/dev/null | tail -1)
echo "   ✅ $LOG_COUNT audit logs in database"

# 5. Frontend check
echo "5. Checking Frontend..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "   ✅ Frontend running"
else
    echo "   ⚠️  Frontend not responding (may need to start)"
fi

echo ""
echo "=== VERIFICATION COMPLETE ==="
```

Run it:
```bash
bash verify.sh
```

---

## 📊 Expected Results

### After First Login:

**Audit Logs Table:**
```
id | tenant_id | user_email | action_type | status | ip_address | created_at
---|-----------|------------|-------------|--------|------------|------------------
 1 | tenant-1  | user@ex... | CREATE      | SUCCESS| 127.0.0.1  | 2026-01-13...
 2 | tenant-1  | user@ex... | LOGIN       | SUCCESS| 127.0.0.1  | 2026-01-13...
```

**API Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "tenantId": "tenant-1",
      "userEmail": "user@example.com",
      "actionType": "LOGIN",
      "entityType": "USER",
      "status": "SUCCESS",
      "ipAddress": "127.0.0.1",
      "createdAt": "2026-01-13T10:30:45"
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "currentPage": 0
}
```

**Frontend Timeline:**
Shows green LOGIN and CREATE icons with timestamps and IP addresses.

---

## ✨ Summary

**Follow this order to verify everything:**

1. ✅ **Fix Frontend** → `npm install && npm run dev`
2. ✅ **Check Backend** → `curl http://localhost:8080/api/auth/health`
3. ✅ **Verify Database** → `psql ... \dt audit_logs`
4. ✅ **Test Registration** → Create user via API
5. ✅ **Check Audit Log** → Query database
6. ✅ **Test Login** → Get JWT token
7. ✅ **Check API** → `curl /api/audit/logs`
8. ✅ **Test UI** → Visit http://localhost:5173/audit-logs

**If all 8 steps pass → System is working! ✅**
