-- Migration: create users table
-- Description: Creates the initial users table
-- Created: 2023-01-01T00:00:00.000Z

-- Up migration
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
-- Create index on role for faster filtering
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

-- Down migration
-- Add DOWN migration statements below (commented out)
-- -- DROP INDEX IF EXISTS idx_users_role;
-- -- DROP INDEX IF EXISTS idx_users_email;
-- -- DROP TABLE users; 