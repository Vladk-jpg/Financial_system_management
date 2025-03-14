import { User } from '../entities/user';

export interface IUserRepository {
  findByPassport(passportNumber: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  delete(id: number): Promise<void>;
}
