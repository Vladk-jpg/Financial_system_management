import { User } from 'src/domain/entities/user';
import { loginDTO } from '../dto/login.dto';

export interface IAuthService {
  login(dto: loginDTO): Promise<string | null>;
  validateUser(email: string): Promise<User | null>;
}