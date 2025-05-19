-- Migration: add user roles
-- Description: Adds a role column to the users table
-- Created: 2023-01-02T00:00:00.000Z

-- Up migration
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';

-- Create index on role for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

-- Down migration
-- Add DOWN migration statements below (commented out)
-- -- DROP INDEX IF EXISTS idx_users_role;
-- -- ALTER TABLE users DROP COLUMN role; 