import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RegisterUserUseCase } from '../../application/use-cases/auth/register-user.use-case';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { PasswordHasher } from '../../shared/utils/password-hasher';

@Module({
  imports: [DatabaseModule], 
  controllers: [AuthController],
  providers: [RegisterUserUseCase, PasswordHasher],
})
export class AuthModule {}
