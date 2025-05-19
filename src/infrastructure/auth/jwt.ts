import { SignJWT, jwtVerify } from 'jose';
import { User } from '../../domain/entities/User';

// Default secret for development - should be overridden in production
const DEFAULT_SECRET = 'super-secret-jwt-key-change-in-production';

// JWT expiry times
const JWT_EXPIRY = '24h'; // 24 hours
const REFRESH_EXPIRY = '7d'; // 7 days

// Define token payload type - compatible with JWTPayload
export interface TokenPayload {
  sub: string; // user id
  email: string;
  role: string;
  iat?: number;
  exp?: number;
  [key: string]: any; // Index signature to satisfy JWTPayload
}

// Store the encoded JWT secret
let encodedSecret: Uint8Array;

/**
 * Initialize JWT module with secret from environment
 */
export function initJwtSecret(secret: string = DEFAULT_SECRET): void {
  encodedSecret = new TextEncoder().encode(secret);
}

/**
 * Generate a JWT token for a user
 */
export async function generateToken(user: User): Promise<string> {
  if (!encodedSecret) {
    initJwtSecret();
  }

  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(encodedSecret);
}

/**
 * Generate a refresh token for a user
 */
export async function generateRefreshToken(user: User): Promise<string> {
  if (!encodedSecret) {
    initJwtSecret();
  }

  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_EXPIRY)
    .sign(encodedSecret);
}

/**
 * Verify a JWT token and return its payload
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  if (!encodedSecret) {
    initJwtSecret();
  }
  
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    
    // Validate required fields exist in payload
    if (!payload.sub || typeof payload.email !== 'string' || typeof payload.role !== 'string') {
      return null;
    }
    
    return payload as TokenPayload;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Parse a JWT token without verification
 * Useful for debugging or extracting non-critical information
 */
export function parseToken(token: string): TokenPayload | null {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    
    // Validate required fields exist in payload
    if (!payload.sub || typeof payload.email !== 'string' || typeof payload.role !== 'string') {
      return null;
    }
    
    return payload as TokenPayload;
  } catch (error) {
    return null;
  }
} 