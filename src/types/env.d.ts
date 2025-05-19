/**
 * Type definitions for Cloudflare Workers environment
 */

interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  ENVIRONMENT: string;
  LOG_LEVEL: string;
}
