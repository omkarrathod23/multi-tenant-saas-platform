# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

For tenant-specific endpoints, include the tenant ID header:
```
X-TENANT-ID: <tenant-id>
```

## Response Format

All API responses follow this structure:

```json
{
  "success": boolean,
  "message": string,
  "data": T,
  "timestamp": "ISO 8601 datetime"
}
```

## Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "data": null,
  "timestamp": "ISO 8601 datetime"
}
```

---

## Authentication Endpoints

### Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user in a tenant

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "tenantId": "1"
}
```

**Validation:**
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- `firstName`: Required
- `lastName`: Required
- `tenantId`: Required

**Response:** `200 OK`
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

**Error Responses:**
- `400 Bad Request`: Validation errors or tenant not found
- `409 Conflict`: User with email already exists

---

### Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "tenantId": "1"
}
```

**Validation:**
- `email`: Required, valid email format
- `password`: Required
- `tenantId`: Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
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

**Error Responses:**
- `400 Bad Request`: Invalid credentials or tenant not found
- `401 Unauthorized`: Invalid email or password

---

## Tenant Management Endpoints

**Note:** All tenant endpoints require `SUPER_ADMIN` role.

### Get All Tenants

**Endpoint:** `GET /api/tenants`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Acme Corp",
      "schema": "acme_corp",
      "subscriptionPlan": "PRO",
      "active": true,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ],
  "timestamp": "2024-01-01T12:00:00"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions

---

### Get Tenant by ID

**Endpoint:** `GET /api/tenants/{id}`

**Path Parameters:**
- `id` (Long): Tenant ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Acme Corp",
    "schema": "acme_corp",
    "subscriptionPlan": "PRO",
    "active": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  },
  "timestamp": "2024-01-01T12:00:00"
}
```

**Error Responses:**
- `400 Bad Request`: Tenant not found
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions

---

### Create Tenant

**Endpoint:** `POST /api/tenants`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Acme Corp",
  "subscriptionPlan": "PRO"
}
```

**Validation:**
- `name`: Required, unique
- `subscriptionPlan`: Optional, defaults to "FREE" (values: "FREE", "PRO")

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Tenant created successfully",
  "data": {
    "id": 1,
    "name": "Acme Corp",
    "schema": "acme_corp",
    "subscriptionPlan": "PRO",
    "active": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  },
  "timestamp": "2024-01-01T12:00:00"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors or tenant name already exists
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions

---

### Update Tenant

**Endpoint:** `PUT /api/tenants/{id}`

**Path Parameters:**
- `id` (Long): Tenant ID

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Acme Corp Updated",
  "subscriptionPlan": "PRO"
}
```

**Validation:**
- `name`: Optional, must be unique if provided
- `subscriptionPlan`: Optional (values: "FREE", "PRO")

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Tenant updated successfully",
  "data": {
    "id": 1,
    "name": "Acme Corp Updated",
    "schema": "acme_corp",
    "subscriptionPlan": "PRO",
    "active": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T12:00:00"
  },
  "timestamp": "2024-01-01T12:00:00"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors or tenant not found
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions

---

### Delete Tenant

**Endpoint:** `DELETE /api/tenants/{id}`

**Path Parameters:**
- `id` (Long): Tenant ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Tenant deleted successfully",
  "data": null,
  "timestamp": "2024-01-01T12:00:00"
}
```

**Note:** This performs a soft delete (sets `active` to `false`).

**Error Responses:**
- `400 Bad Request`: Tenant not found
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions

---

## User Management Endpoints

**Note:** User endpoints require `TENANT_ADMIN` or `SUPER_ADMIN` role. All operations are scoped to the tenant specified in `X-TENANT-ID` header.

### Get All Users

**Endpoint:** `GET /api/users`

**Headers:**
```
Authorization: Bearer <token>
X-TENANT-ID: 1
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "tenantId": 1,
      "active": true,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ],
  "timestamp": "2024-01-01T12:00:00"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions

---

### Get User by ID

**Endpoint:** `GET /api/users/{id}`

**Path Parameters:**
- `id` (Long): User ID

**Headers:**
```
Authorization: Bearer <token>
X-TENANT-ID: 1
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "tenantId": 1,
    "active": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  },
  "timestamp": "2024-01-01T12:00:00"
}
```

**Error Responses:**
- `400 Bad Request`: User not found or doesn't belong to tenant
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions

---

### Create User

**Endpoint:** `POST /api/users`

**Headers:**
```
Authorization: Bearer <token>
X-TENANT-ID: 1
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "USER"
}
```

**Validation:**
- `email`: Required, valid email format, unique within tenant
- `password`: Required, minimum 6 characters
- `firstName`: Required
- `lastName`: Required
- `role`: Optional, defaults to "USER" (values: "USER", "TENANT_ADMIN", "SUPER_ADMIN")

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 2,
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "USER",
    "tenantId": 1,
    "active": true,
    "createdAt": "2024-01-01T12:00:00",
    "updatedAt": "2024-01-01T12:00:00"
  },
  "timestamp": "2024-01-01T12:00:00"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors or user already exists
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions

---

### Update User

**Endpoint:** `PUT /api/users/{id}`

**Path Parameters:**
- `id` (Long): User ID

**Headers:**
```
Authorization: Bearer <token>
X-TENANT-ID: 1
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "updated@example.com",
  "password": "newpassword123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "TENANT_ADMIN"
}
```

**Validation:**
- `email`: Optional, must be unique if provided
- `password`: Optional, minimum 6 characters if provided
- `firstName`: Optional
- `lastName`: Optional
- `role`: Optional (values: "USER", "TENANT_ADMIN", "SUPER_ADMIN")

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 2,
    "email": "updated@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "TENANT_ADMIN",
    "tenantId": 1,
    "active": true,
    "createdAt": "2024-01-01T12:00:00",
    "updatedAt": "2024-01-01T12:30:00"
  },
  "timestamp": "2024-01-01T12:30:00"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors, user not found, or doesn't belong to tenant
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions

---

### Delete User

**Endpoint:** `DELETE /api/users/{id}`

**Path Parameters:**
- `id` (Long): User ID

**Headers:**
```
Authorization: Bearer <token>
X-TENANT-ID: 1
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null,
  "timestamp": "2024-01-01T12:00:00"
}
```

**Note:** This performs a soft delete (sets `active` to `false`).

**Error Responses:**
- `400 Bad Request`: User not found or doesn't belong to tenant
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions

---

## Status Codes

- `200 OK`: Request successful
- `400 Bad Request`: Validation error or business logic error
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions for the requested operation
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider implementing rate limiting using Spring Security or a dedicated library.

---

## Pagination

Currently, all list endpoints return all records. For production with large datasets, implement pagination using Spring Data's `Pageable` interface.

---

## Filtering and Sorting

Currently not implemented. Consider adding query parameters for filtering and sorting in production.

