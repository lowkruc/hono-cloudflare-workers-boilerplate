import { Hono } from 'hono';
import { GetUserUseCase } from '../../application/usecases/user/GetUserUseCase';
import { D1UserRepository } from '../../infrastructure/database/D1UserRepository';

// Create a dedicated router for user endpoints
const userRouter = new Hono<{
  Bindings: {
    DB: D1Database;
    CACHE: KVNamespace;
  };
}>();

// Handle GET /users/:id
userRouter.get('/:id', async c => {
  const id = c.req.param('id');

  if (!id) {
    return c.json({ error: 'User ID is required' }, 400);
  }

  // Create dependencies - in a real app, use a proper DI container
  const userRepository = new D1UserRepository(c.env.DB);
  const getUserUseCase = new GetUserUseCase(userRepository);

  try {
    const user = await getUserUseCase.execute(id);

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error(`Error getting user ${id}:`, error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default userRouter;
