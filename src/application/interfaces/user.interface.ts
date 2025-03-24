import { User } from 'src/domain/entities/user';
import { CreateUserDTO } from '../dto/create-user.dto';

export interface IUserService {
  createUser(dto: CreateUserDTO): Promise<User | null>;
  getUserById(id: number): Promise<User | null>;
  getUserByPassport(passNum: string): Promise<User | null>;
  deleteUser(id: number): Promise<void>;
  getAllInactiveUsers(): Promise<User[]>;
  activateUser(id: number): Promise<void>;
}