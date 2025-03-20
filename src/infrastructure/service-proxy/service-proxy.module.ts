import { DynamicModule, Module } from '@nestjs/common';

import { BankService } from 'src/application/services/bank.service';

import { LoggerModule } from '../middleware/logger/logger.module';
import { LoggerService } from '../middleware/logger/logger.service';

import { DatabaseModule } from '../database/database.module';
import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { BcryptService } from '../services/bcrypt/bcrypt.service';

import { BankRepository } from '../database/repositories/bank.repository.impl';

import { ServiceProxy } from './service-proxy';
import { UserRepository } from '../database/repositories/user.repository.impl';
import { UserService } from 'src/application/services/user.service';
import { JwtModule } from '../services/jwt/jwt.module';
import { JwtService } from '../services/jwt/jwt.service';
import { AuthService } from 'src/application/services/auth.service';
import { ProfileService } from 'src/application/services/profile.service';
import { AccountRepository } from '../database/repositories/account.repository.impl';
import { IBANgenerator } from '../services/IBAN/iban-gen.service';
import { IBANModule } from '../services/IBAN/iban-gen.module';
import { AccountService } from 'src/application/services/account.service';
import { UnitOfWorkService } from '../database/utils/unit-of-work.service';
import { TransactionRepository } from '../database/repositories/transaction.repository.impl';
import { TransactionService } from 'src/application/services/transaction.service';
import { EnterpriseRepository } from '../database/repositories/enterprise.repository.impl';
import { EnterpriseService } from 'src/application/services/enterprise.service';

@Module({
  imports: [LoggerModule, DatabaseModule, BcryptModule, JwtModule, IBANModule],
})
export class ServiceProxyModule {
  static AUTH_SERVICE_PROXY = 'authServiceProxy';
  static BANK_SERVICE_PROXY = 'bankServiceProxy';
  static USER_SERVICE_PROXY = 'userServiceProxy';
  static PROFILE_SERVICE_PROXY = 'profileServiceProxy';
  static ACCOUNT_SERVICE_PROXY = 'accountServiceProxy';
  static TRANSACTION_SERVICE_PROXY = 'transactionServiceProxy';
  static ENTERPRISE_SERVICE_PROXY = 'enterpriseServiceProxy';

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
        {
          inject: [UserRepository],
          provide: ServiceProxyModule.PROFILE_SERVICE_PROXY,
          useFactory: (repo: UserRepository) =>
            new ServiceProxy(new ProfileService(repo)),
        },
        {
          inject: [AccountRepository, IBANgenerator],
          provide: ServiceProxyModule.ACCOUNT_SERVICE_PROXY,
          useFactory: (repo: AccountRepository, iban: IBANgenerator) =>
            new ServiceProxy(new AccountService(repo, iban)),
        },
        {
          inject: [UnitOfWorkService, AccountRepository, TransactionRepository],
          provide: ServiceProxyModule.TRANSACTION_SERVICE_PROXY,
          useFactory: (
            uow: UnitOfWorkService,
            accountRepo: AccountRepository,
            transactionRepo: TransactionRepository,
          ) =>
            new ServiceProxy(
              new TransactionService(uow, accountRepo, transactionRepo),
            ),
        },
        {
          inject: [BankRepository, EnterpriseRepository],
          provide: ServiceProxyModule.ENTERPRISE_SERVICE_PROXY,
          useFactory: (
            bankRepo: BankRepository,
            enterRepo: EnterpriseRepository,
          ) => new ServiceProxy(new EnterpriseService(enterRepo, bankRepo)),
        },
      ],
      exports: [
        ServiceProxyModule.BANK_SERVICE_PROXY,
        ServiceProxyModule.USER_SERVICE_PROXY,
        ServiceProxyModule.AUTH_SERVICE_PROXY,
        ServiceProxyModule.PROFILE_SERVICE_PROXY,
        ServiceProxyModule.ACCOUNT_SERVICE_PROXY,
        ServiceProxyModule.TRANSACTION_SERVICE_PROXY,
        ServiceProxyModule.ENTERPRISE_SERVICE_PROXY,
      ],
    };
  }
}
