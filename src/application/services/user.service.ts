import { ILogger } from 'src/domain/logger/logger.interface';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { CreateUserDTO } from '../dto/create-user.dto';
import { User } from 'src/domain/entities/user';
import { IBcryptService } from 'src/domain/adapters/bcrypt.interfase';
import { IException } from 'src/domain/interfaces/exceptions.interface';

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger,
    private readonly hasher: IBcryptService,
    private readonly exception: IException,
  ) {}

  async createUser(dto: CreateUserDTO): Promise<User | null> {
    if (dto.password !== dto.confirmPassword) return null;

    const hashedPassword = await this.hasher.hash(dto.password);
    const user = new User(
      dto.fullName,
      dto.passportNumber,
      dto.identificationNumber,
      dto.phone,
      dto.email,
      hashedPassword,
      dto.isForeign,
    );
    user.isActive = false;
    return this.userRepository.create(user);
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    return user;
  }

  async getUserByPassport(passNum: string): Promise<User | null> {
    return await this.userRepository.findByPassport(passNum);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getAllInactiveUsers(): Promise<User[]> {
    return await this.userRepository.findAllInactive();
  }

  async activateUser(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      this.exception.badRequestException({ message: 'User not found' });
    } else {
      user.isActive = true;
      this.userRepository.update(user);
    }
  }
}
