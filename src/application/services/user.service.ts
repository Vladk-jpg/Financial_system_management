import { ILogger } from 'src/domain/logger/logger.interface';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { CreateUserDTO } from '../dto/create-user.dto';
import { User } from 'src/domain/entities/user';
import { IBcryptService } from 'src/domain/adapters/bcrypt.interfase';
import { Profile } from 'src/domain/entities/profile';
import { ProfileMapper } from '../mappers/profile.mapper';

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger,
    private readonly hasher: IBcryptService,
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

  async getProfile(id: number): Promise<Profile | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    const profile = ProfileMapper.toProfile(user);
    return profile;
  }
}
