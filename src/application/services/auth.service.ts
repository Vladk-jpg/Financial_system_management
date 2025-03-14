import { Injectable } from '@nestjs/common';
import { IJwtService } from 'src/domain/adapters/jwt.interface';
import { User } from 'src/domain/entities/user';
import { loginDTO } from '../dto/login.dto';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { IBcryptService } from 'src/domain/adapters/bcrypt.interfase';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: IJwtService,
    private readonly userRepository: IUserRepository,
    private readonly hasher: IBcryptService,
  ) {}

  async login(dto: loginDTO): Promise<string | null> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) return null;
    const isCompare = await this.hasher.compare(dto.password, user.passwordHash);
    if (!isCompare) return null;

    const payload = {email: user.email, sub: user.id, role: user.role};
    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }

  async validateUser(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }
}
