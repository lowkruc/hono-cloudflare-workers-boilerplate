import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from './logger';
import userRouter from '../interfaces/routes/userRoutes';
import authRouter from '../interfaces/routes/authRoutes';
import { initJwtSecret } from './auth/jwt';

// Define environment interface for type-safety
interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  ENVIRONMENT: string;
  LOG_LEVEL: string;
  JWT_SECRET?: string;
}

// Create the main app
const app = new Hono<{ Bindings: Env }>();

// Set up logger middleware and configure with environment variables
app.use('*', async (c, next) => {
  // Configure logger based on environment
  if (c.env.LOG_LEVEL) {
    logger.setLogLevel(c.env.LOG_LEVEL);
  } else if (c.env.ENVIRONMENT === 'development') {
    logger.setLogLevel('debug');
  }

  // Initialize JWT with secret from environment
  if (c.env.JWT_SECRET) {
    initJwtSecret(c.env.JWT_SECRET);
  } else {
    initJwtSecret();
  }

  await next();
});

// CORS middleware
app.use('*', cors());

// Request logging middleware
app.use('*', async (c, next) => {
  const startTime = Date.now();
  await next();
  const endTime = Date.now();
  logger.info(`${c.req.method} ${c.req.url} - ${endTime - startTime}ms`);
});

// Health check route
app.get('/', c => {
  return c.json({
    status: 'success',
    data: {
      message: 'Gohono Cloudflare API is running',
      timestamp: new Date().toISOString(),
      environment: c.env.ENVIRONMENT || 'unknown',
    }
  });
});

// API routes
app.route('/api/users', userRouter);
app.route('/api/auth', authRouter);

// 404 handler
app.notFound(c => {
  return c.json(
    {
      status: 'error',
      message: 'Not Found',
    },
    404,
  );
});

// Error handler
app.onError((err, c) => {
  logger.error('Server error', { error: err.message, stack: err.stack });
  return c.json(
    {
      status: 'error',
      message: 'Internal Server Error',
    },
    500,
  );
});

// Export for Cloudflare Workers
export default app;
