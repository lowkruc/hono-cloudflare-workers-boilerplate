-- Migration: add_user_status
-- Description: Adds a status column to track user account status
-- Created: 2025-05-19T03:30:02.314Z

-- Up migration
ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'active';

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_users_status ON users (status);

-- Down migration
-- Add DOWN migration statements below (commented out)
-- -- DROP INDEX IF EXISTS idx_users_status;
-- -- ALTER TABLE users DROP COLUMN status;
