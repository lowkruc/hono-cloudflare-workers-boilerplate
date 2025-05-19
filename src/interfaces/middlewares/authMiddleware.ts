import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verifyToken } from '../../infrastructure/auth/jwt';
import { AUTH_COOKIE } from '../../infrastructure/auth/cookie';

/**
 * Authentication middleware
 * Validates the JWT token from Authorization header or cookie
 */
export async function authenticate(c: Context, next: Next) {
  // Get token from Authorization header or cookie
  const authHeader = c.req.header('Authorization');
  const authCookie = getCookie(c, AUTH_COOKIE);
  
  let token: string | undefined;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7); // Remove 'Bearer ' prefix
  } else if (authCookie) {
    token = authCookie;
  }
  
  if (!token) {
    return c.json(
      {
        status: 'error',
        message: 'Authentication required',
      },
      401
    );
  }
  
  // Verify token
  const payload = await verifyToken(token);
  
  if (!payload) {
    return c.json(
      {
        status: 'error',
        message: 'Invalid or expired token',
      },
      401
    );
  }
  
  // Set user info in context for route handlers
  c.set('user', {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  });
  
  await next();
}

/**
 * Role-based authorization middleware
 * Requires the authenticate middleware to be used first
 * @param roles - Array of roles allowed to access the route
 */
export function authorize(roles: string[]) {
  return async function(c: Context, next: Next) {
    const user = c.get('user');
    
    if (!user) {
      return c.json(
        {
          status: 'error',
          message: 'Authentication required',
        },
        401
      );
    }
    
    if (!roles.includes(user.role)) {
      return c.json(
        {
          status: 'error',
          message: 'Insufficient permissions',
        },
        403
      );
    }
    
    await next();
  };
} 