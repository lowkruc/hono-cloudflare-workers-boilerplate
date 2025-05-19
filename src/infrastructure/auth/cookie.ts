import { serialize, SerializeOptions } from 'cookie';

// Cookie names
export const AUTH_COOKIE = 'auth_token';
export const REFRESH_COOKIE = 'refresh_token';

// Default options for auth cookies
const defaultOptions: SerializeOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 86400, // 24 hours in seconds
};

// Default options for refresh cookies - longer expiry, specific path
const refreshOptions: SerializeOptions = {
  ...defaultOptions,
  path: '/api/auth/refresh',
  maxAge: 604800, // 7 days in seconds
};

/**
 * Set an authentication token cookie
 */
export function setAuthCookie(token: string): string {
  return serialize(AUTH_COOKIE, token, defaultOptions);
}

/**
 * Set a refresh token cookie
 */
export function setRefreshCookie(token: string): string {
  return serialize(REFRESH_COOKIE, token, refreshOptions);
}

/**
 * Clear the authentication token cookie
 */
export function clearAuthCookie(): string {
  return serialize(AUTH_COOKIE, '', {
    ...defaultOptions,
    maxAge: 0,
    expires: new Date(0),
  });
}

/**
 * Clear the refresh token cookie
 */
export function clearRefreshCookie(): string {
  return serialize(REFRESH_COOKIE, '', {
    ...refreshOptions,
    maxAge: 0,
    expires: new Date(0),
  });
} 