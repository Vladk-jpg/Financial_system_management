import { DynamicModule, Module } from '@nestjs/common';

import { BankService } from 'src/application/services/bank.service';

import { LoggerModule } from '../middleware/logger/logger.module';
import { LoggerService } from '../middleware/logger/logger.service';

// import { BcryptModule } from '../services/bcrypt/bcrypt.module';
// import { BcryptService } from '../services/bcrypt/bcrypt.service';
// import { JwtModule } from '../services/jwt/jwt.module';
// import { JwtTokenService } from '../services/jwt/jwt.service';
import { DatabaseModule } from '../database/database.module';
import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { BcryptService } from '../services/bcrypt/bcrypt.service';

import { BankRepository } from '../database/repositories/bank.repository.impl';

// import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
// import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { ServiceProxy } from './service-proxy';
import { UserRepository } from '../database/repositories/user.repository.impl';
import { UserService } from 'src/application/services/user.service';
import { JwtModule } from '../services/jwt/jwt.module';
import { JwtService } from '../services/jwt/jwt.service';
import { AuthService } from 'src/application/services/auth.service';

@Module({
  imports: [LoggerModule, DatabaseModule, BcryptModule, JwtModule],
})
export class ServiceProxyModule {
  // Auth
  //   static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  //   static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';
  //   static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';
  static AUTH_SERVICE_PROXY = 'AuthServiceProxy';

  static BANK_SERVICE_PROXY = 'bankServiceProxy';
  static USER_SERVICE_PROXY = 'userServiceProxy';

  static register(): DynamicModule {
    return {
      module: ServiceProxyModule,
      providers: [
        {
          inject: [LoggerService, BankRepository],
          provide: ServiceProxyModule.BANK_SERVICE_PROXY,
          useFactory: (logger: LoggerService, repo: BankRepository) =>
            new ServiceProxy(new BankService(logger, repo)),
        },
        {
          inject: [LoggerService, UserRepository, BcryptService],
          provide: ServiceProxyModule.USER_SERVICE_PROXY,
          useFactory: (
            logger: LoggerService,
            repo: UserRepository,
            bcrypt: BcryptService,
          ) => new ServiceProxy(new UserService(repo, logger, bcrypt)),
        },
        {
          inject: [JwtService, UserRepository, BcryptService],
          provide: ServiceProxyModule.AUTH_SERVICE_PROXY,
          useFactory: (
            jwtService: JwtService,
            repo: UserRepository,
            bcrypt: BcryptService,
          ) => new ServiceProxy(new AuthService(jwtService, repo, bcrypt)),
        },
      ],
      exports: [
        ServiceProxyModule.BANK_SERVICE_PROXY,
        ServiceProxyModule.USER_SERVICE_PROXY,
        ServiceProxyModule.AUTH_SERVICE_PROXY,
      ],
    };
  }
}
