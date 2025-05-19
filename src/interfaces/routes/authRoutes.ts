import { Hono } from 'hono';
import { AuthController } from '../controllers/AuthController';
import { D1UserRepository } from '../../infrastructure/database/D1UserRepository';

// Create a dedicated router for auth endpoints
const authRouter = new Hono<{
  Bindings: {
    DB: D1Database;
    CACHE: KVNamespace;
  }
}>();

// Handle POST /auth/register
authRouter.post('/register', async (c) => {
  const userRepository = new D1UserRepository(c.env.DB);
  const authController = new AuthController(userRepository);
  
  return authController.register(c);
});

// Handle POST /auth/login
authRouter.post('/login', async (c) => {
  const userRepository = new D1UserRepository(c.env.DB);
  const authController = new AuthController(userRepository);
  
  return authController.login(c);
});

// Handle POST /auth/refresh
authRouter.post('/refresh', async (c) => {
  const userRepository = new D1UserRepository(c.env.DB);
  const authController = new AuthController(userRepository);
  
  return authController.refresh(c);
});

// Handle POST /auth/logout
authRouter.post('/logout', async (c) => {
  const userRepository = new D1UserRepository(c.env.DB);
  const authController = new AuthController(userRepository);
  
  return authController.logout(c);
});

export default authRouter; 