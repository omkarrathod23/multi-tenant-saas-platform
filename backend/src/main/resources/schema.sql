-- Create master schema for global tenant data
CREATE SCHEMA IF NOT EXISTS master;

-- Create tenants table in master schema
CREATE TABLE IF NOT EXISTS master.tenants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    schema VARCHAR(255) NOT NULL UNIQUE,
    subscription_plan VARCHAR(50) NOT NULL DEFAULT 'FREE',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Create a default super admin tenant (optional - can be created via API)
-- INSERT INTO master.tenants (name, schema, subscription_plan, active, created_at, updated_at)
-- VALUES ('Super Admin', 'master', 'PRO', true, NOW(), NOW());

