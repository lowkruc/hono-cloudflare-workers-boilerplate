import { Context } from 'hono';
import { setCookie, getCookie } from 'hono/cookie';
import { z } from 'zod';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserEntity } from '../../domain/entities/User';
import { comparePassword, hashPassword } from '../../infrastructure/auth/password';
import { generateToken, generateRefreshToken, verifyToken } from '../../infrastructure/auth/jwt';
import { 
  setAuthCookie, 
  setRefreshCookie, 
  clearAuthCookie, 
  clearRefreshCookie 
} from '../../infrastructure/auth/cookie';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export class AuthController {
  constructor(private userRepository: UserRepository) {}

  async register(c: Context) {
    try {
      // Validate request body
      const result = registerSchema.safeParse(await c.req.json());
      
      if (!result.success) {
        return c.json({
          status: 'error',
          message: 'Invalid input data',
          details: result.error.errors,
        }, 400);
      }
      
      const { email, password, name } = result.data;
      
      // Check if user already exists
      const existingUsers = await this.userRepository.findAll();
      const existingUser = existingUsers.find(user => user.email === email);
      
      if (existingUser) {
        return c.json({
          status: 'error',
          message: 'Email already registered',
        }, 409);
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create new user
      const user = await this.userRepository.create({
        email,
        name,
        password: hashedPassword,
        role: 'user',
      });
      
      // Generate tokens
      const token = await generateToken(user);
      const refreshToken = await generateRefreshToken(user);
      
      // Set cookies
      setCookie(c, 'auth_token', token, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });
      setCookie(c, 'refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/api/auth/refresh' });
      
      // Return response with sanitized user (exclude password)
      const { password: _, ...userWithoutPassword } = user;
      return c.json({
        status: 'success',
        data: {
          user: userWithoutPassword,
          token,
        },
      }, 201);
    } catch (error) {
      console.error('Register error:', error);
      return c.json({
        status: 'error',
        message: 'Server error',
      }, 500);
    }
  }

  async login(c: Context) {
    try {
      // Validate request body
      const result = loginSchema.safeParse(await c.req.json());
      
      if (!result.success) {
        return c.json({
          status: 'error',
          message: 'Invalid credentials',
        }, 400);
      }
      
      const { email, password } = result.data;
      
      // Find user by email
      const users = await this.userRepository.findAll();
      const user = users.find(u => u.email === email);
      
      if (!user || !user.password) {
        return c.json({
          status: 'error',
          message: 'Invalid credentials',
        }, 401);
      }
      
      // Compare password
      const passwordMatch = await comparePassword(password, user.password);
      
      if (!passwordMatch) {
        return c.json({
          status: 'error',
          message: 'Invalid credentials',
        }, 401);
      }
      
      // Generate tokens
      const token = await generateToken(user);
      const refreshToken = await generateRefreshToken(user);
      
      // Set cookies
      setCookie(c, 'auth_token', token, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });
      setCookie(c, 'refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/api/auth/refresh' });
      
      // Return response with sanitized user (exclude password)
      const { password: _, ...userWithoutPassword } = user;
      return c.json({
        status: 'success',
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return c.json({
        status: 'error',
        message: 'Server error',
      }, 500);
    }
  }

  async refresh(c: Context) {
    try {
      // Get refresh token from cookie
      const refreshToken = getCookie(c, 'refresh_token');
      
      if (!refreshToken) {
        return c.json({
          status: 'error',
          message: 'Refresh token required',
        }, 401);
      }
      
      // Verify refresh token (implement token verification logic)
      const payload = await verifyToken(refreshToken);
      
      if (!payload || !payload.sub) {
        return c.json({
          status: 'error',
          message: 'Invalid refresh token',
        }, 401);
      }
      
      // Find user
      const user = await this.userRepository.findById(payload.sub);
      
      if (!user) {
        return c.json({
          status: 'error',
          message: 'User not found',
        }, 401);
      }
      
      // Generate new tokens
      const newToken = await generateToken(user);
      
      // Set cookie
      setCookie(c, 'auth_token', newToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });
      
      // Return response
      return c.json({
        status: 'success',
        data: {
          token: newToken,
        },
      });
    } catch (error) {
      console.error('Refresh error:', error);
      return c.json({
        status: 'error',
        message: 'Server error',
      }, 500);
    }
  }

  async logout(c: Context) {
    // Clear cookies
    setCookie(c, 'auth_token', '', { httpOnly: true, secure: true, sameSite: 'Strict', path: '/', maxAge: 0 });
    setCookie(c, 'refresh_token', '', { httpOnly: true, secure: true, sameSite: 'Strict', path: '/api/auth/refresh', maxAge: 0 });
    
    return c.json({
      status: 'success',
      data: {
        message: 'Successfully logged out',
      },
    });
  }
} 