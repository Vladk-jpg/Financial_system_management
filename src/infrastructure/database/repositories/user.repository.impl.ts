import { IUserRepository } from '../../../domain/interfaces/user.repository';
import { User } from '../../../domain/entities/user';

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.getEmail() === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.getId() === id) || null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
