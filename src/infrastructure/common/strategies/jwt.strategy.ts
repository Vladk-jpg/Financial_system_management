import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/application/services/auth.service';
import { Request as ExpressRequest } from 'express';
import { ServiceProxyModule } from 'src/infrastructure/service-proxy/service-proxy.module';
import { ServiceProxy } from 'src/infrastructure/service-proxy/service-proxy';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ServiceProxyModule.AUTH_SERVICE_PROXY)
    private readonly authService: ServiceProxy<AuthService>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: ExpressRequest) => {
          return req?.cookies?.accessToken || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'key',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.getInstance().validateUser(payload.email);
    return user;
  }
}
