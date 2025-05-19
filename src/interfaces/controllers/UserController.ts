import { Context } from 'hono';
import { GetUserUseCase } from '../../application/usecases/user/GetUserUseCase';
import { z } from 'zod';

export class UserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  async getUser(c: Context): Promise<Response> {
    try {
      const paramsSchema = z.object({
        id: z.string().min(1),
      });

      const params = paramsSchema.safeParse(c.req.param());

      if (!params.success) {
        return c.json({ error: 'Invalid user ID' }, 400);
      }

      const user = await this.getUserUseCase.execute(params.data.id);

      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }

      return c.json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }
}
