import { User, UserEntity } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { logger } from '../logger';

export class D1UserRepository implements UserRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<User | null> {
    try {
      const { results } = await this.db
        .prepare('SELECT * FROM users WHERE id = ?')
        .bind(id)
        .all();
      
      if (!results || results.length === 0) {
        return null;
      }
      
      const userData = results[0] as Record<string, unknown>;
      
      return new UserEntity({
        id: userData.id as string,
        email: userData.email as string,
        name: userData.name as string,
        role: userData.role as string,
        password: userData.password as string,
        createdAt: userData.created_at as string,
        updatedAt: userData.updated_at as string,
      });
    } catch (error) {
      logger.error('Error finding user by id', { error, id });
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const { results } = await this.db
        .prepare('SELECT * FROM users WHERE email = ?')
        .bind(email)
        .all();
      
      if (!results || results.length === 0) {
        return null;
      }
      
      const userData = results[0] as Record<string, unknown>;
      
      return new UserEntity({
        id: userData.id as string,
        email: userData.email as string,
        name: userData.name as string,
        role: userData.role as string,
        password: userData.password as string,
        createdAt: userData.created_at as string,
        updatedAt: userData.updated_at as string,
      });
    } catch (error) {
      logger.error('Error finding user by email', { error, email });
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const { results } = await this.db
        .prepare('SELECT * FROM users ORDER BY created_at DESC')
        .all();
      
      if (!results) {
        return [];
      }
      
      return results.map((userData: Record<string, unknown>) => new UserEntity({
        id: userData.id as string,
        email: userData.email as string,
        name: userData.name as string,
        role: userData.role as string,
        password: userData.password as string,
        createdAt: userData.created_at as string,
        updatedAt: userData.updated_at as string,
      }));
    } catch (error) {
      logger.error('Error finding all users', { error });
      throw error;
    }
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      await this.db
        .prepare('INSERT INTO users (id, email, name, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(id, userData.email, userData.name, userData.password, userData.role, now, now)
        .run();
      
      return new UserEntity({
        id,
        ...userData,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      logger.error('Error creating user', { error, userData });
      throw error;
    }
  }

  async update(
    id: string,
    userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<User | null> {
    try {
      // First check if user exists
      const existingUser = await this.findById(id);
      
      if (!existingUser) {
        return null;
      }
      
      // Build SET part of query
      const setValues: string[] = [];
      const bindValues: unknown[] = [];
      
      if (userData.email !== undefined) {
        setValues.push('email = ?');
        bindValues.push(userData.email);
      }
      
      if (userData.name !== undefined) {
        setValues.push('name = ?');
        bindValues.push(userData.name);
      }
      
      if (userData.password !== undefined) {
        setValues.push('password = ?');
        bindValues.push(userData.password);
      }
      
      if (userData.role !== undefined) {
        setValues.push('role = ?');
        bindValues.push(userData.role);
      }
      
      // Always update updated_at
      const now = new Date().toISOString();
      setValues.push('updated_at = ?');
      bindValues.push(now);
      
      // Add id for WHERE clause
      bindValues.push(id);
      
      // Execute update
      await this.db
        .prepare(`UPDATE users SET ${setValues.join(', ')} WHERE id = ?`)
        .bind(...bindValues)
        .run();
      
      // Get updated user
      return this.findById(id);
    } catch (error) {
      logger.error('Error updating user', { error, id, userData });
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.db
        .prepare('DELETE FROM users WHERE id = ?')
        .bind(id)
        .run();
      
      return !!result.meta?.rows_affected;
    } catch (error) {
      logger.error('Error deleting user', { error, id });
      throw error;
    }
  }
}
