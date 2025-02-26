import { User, UserRole } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { CreateUserDTO } from '../../dto/create-user.dto';
import { PasswordHasher } from '../../../shared/utils/password-hasher';
import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/shared/constants/constants'; 

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(dto: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User already exist');
    }
    if(dto.confirmPassword !== dto.password){
      throw new Error('Passwords do not match');
    }

    const passwordHash = await this.passwordHasher.hashPassword(dto.password);
    const newUser = new User(
      crypto.randomUUID(),
      dto.fullName,
      dto.passportNumber,
      dto.identificationNumber,
      dto.phone,
      dto.email,
      passwordHash,
      UserRole.CLIENT,
      dto.isForeign,
    );

    await this.userRepository.save(newUser);
    return newUser;
  }
}
