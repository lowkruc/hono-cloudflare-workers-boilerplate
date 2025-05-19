-- Migration: add password to users
-- Description: Adds password column to users table for authentication
-- Created: 2025-05-19T03:52:00.000Z

-- Up migration
ALTER TABLE users ADD COLUMN password TEXT;

-- Down migration
-- Note: SQLite doesn't support dropping columns directly
-- We would need to create a new table without the column and copy data
-- This is commented out as it's complex and potentially dangerous
-- CREATE TABLE users_new (
--     id TEXT PRIMARY KEY,
--     email TEXT UNIQUE NOT NULL,
--     name TEXT NOT NULL,
--     role TEXT NOT NULL DEFAULT 'user',
--     created_at TEXT NOT NULL,
--     updated_at TEXT NOT NULL
-- );
-- INSERT INTO users_new SELECT id, email, name, role, created_at, updated_at FROM users;
-- DROP TABLE users;
-- ALTER TABLE users_new RENAME TO users;
