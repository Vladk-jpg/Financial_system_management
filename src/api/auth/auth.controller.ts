import { Controller, Post, Body, HttpCode, ConflictException, BadRequestException } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/auth/register-user.use-case';
import { CreateUserDTO } from '../../application/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() createUserDTO: CreateUserDTO): Promise<{ message: string }> {
    try {
      await this.registerUserUseCase.execute(createUserDTO);
      return { message: 'User registered successfully' };
    } catch (error: any) {
      if (error.message === 'User already exist') {
        throw new ConflictException('User already exists');
      }
      if (error.message === 'Passwords do not match'){
        throw new BadRequestException('Passwords do not match')
      }
      throw error;
    }
  }
}
