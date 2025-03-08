import { DynamicModule, Module } from '@nestjs/common';

import { BankService } from 'src/application/services/bank.service';

import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerModule } from '../middleware/logger/logger.module';
import { LoggerService } from '../middleware/logger/logger.service';

// import { BcryptModule } from '../services/bcrypt/bcrypt.module';
// import { BcryptService } from '../services/bcrypt/bcrypt.service';
// import { JwtModule } from '../services/jwt/jwt.module';
// import { JwtTokenService } from '../services/jwt/jwt.service';
import { DatabaseModule } from '../database/database.module';

import { BankRepository } from '../database/repositories/bank.repository.impl';

// import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
// import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { ServiceProxy } from './service-proxy';

@Module({
  imports: [LoggerModule, DatabaseModule, ExceptionsModule],
})
export class ServiceProxyModule {
  // Auth
//   static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
//   static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';
//   static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';

  static BANK_SERVICE_PROXY = 'bankServiceProxy';

  static register(): DynamicModule {
    return {
      module: ServiceProxyModule,
      providers: [
        {
          inject: [LoggerService, BankRepository],
          provide: ServiceProxyModule.BANK_SERVICE_PROXY,
          useFactory: (logger: LoggerService, repo: BankRepository) => 
            new ServiceProxy(new BankService(logger, repo))
        },
      ],
      exports: [
        ServiceProxyModule.BANK_SERVICE_PROXY
      ],
    };
  }
}
