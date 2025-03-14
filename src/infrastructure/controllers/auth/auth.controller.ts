import {
  Body,
  Controller,
  Inject,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/application/services/auth.service';
import { ServiceProxyModule } from 'src/infrastructure/service-proxy/service-proxy.module';
import { ServiceProxy } from 'src/infrastructure/service-proxy/service-proxy';
import { loginDTO } from 'src/application/dto/login.dto';
import { FastifyReply } from 'fastify';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  private readonly authService: AuthService;

  constructor(
    @Inject(ServiceProxyModule.AUTH_SERVICE_PROXY)
    private readonly userServiceProxy: ServiceProxy<AuthService>,
  ) {
    this.authService = this.userServiceProxy.getInstance();
  }

  @Post('login')
  async login(
    @Body() dto: loginDTO,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const token = await this.authService.login(dto);
    if (!token) throw new UnauthorizedException('Incorrect email or password');
    response.setCookie('accessToken', token, {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
      sameSite: 'lax',
    });
    return 'login successfuly';
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Res({ passthrough: true }) response: FastifyReply) {
    response.clearCookie('accessToken', {
        path: '/', 
      });
    return 'Logout successful';
  }
}
