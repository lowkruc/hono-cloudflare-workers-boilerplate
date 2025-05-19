import { describe, it, expect, vi } from 'vitest';
import { GetUserUseCase } from './GetUserUseCase';
import { UserRepository } from '../../../domain/repositories/UserRepository';

describe('GetUserUseCase', () => {
  it('should get a user by id', async () => {
    // Arrange
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockUserRepository: UserRepository = {
      findById: vi.fn().mockResolvedValue(mockUser),
      findAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const getUserUseCase = new GetUserUseCase(mockUserRepository);

    // Act
    const result = await getUserUseCase.execute('1');

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockUser);
  });

  it('should return null when user not found', async () => {
    // Arrange
    const mockUserRepository: UserRepository = {
      findById: vi.fn().mockResolvedValue(null),
      findAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const getUserUseCase = new GetUserUseCase(mockUserRepository);

    // Act
    const result = await getUserUseCase.execute('nonexistent');

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith('nonexistent');
    expect(result).toBeNull();
  });
});
