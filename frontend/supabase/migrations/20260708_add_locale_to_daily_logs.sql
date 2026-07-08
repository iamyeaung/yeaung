-- Migration to add locale column to daily_logs table for multi-language support
ALTER TABLE daily_logs ADD COLUMN locale text NOT NULL DEFAULT 'en';
