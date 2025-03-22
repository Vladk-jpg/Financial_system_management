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
import { EAccountRepository } from '../database/repositories/e-account.repository.impl';
import { EAccountService } from 'src/application/services/e-account.service';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { SalaryProjectRepository } from '../database/repositories/salary-project.repository.impl';
import { SalaryProjectService } from 'src/application/services/salary-project.service';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    BcryptModule,
    JwtModule,
    IBANModule,
    ExceptionsModule,
  ],
})
export class ServiceProxyModule {
  static AUTH_SERVICE_PROXY = 'authServiceProxy';
  static BANK_SERVICE_PROXY = 'bankServiceProxy';
  static USER_SERVICE_PROXY = 'userServiceProxy';
  static PROFILE_SERVICE_PROXY = 'profileServiceProxy';
  static ACCOUNT_SERVICE_PROXY = 'accountServiceProxy';
  static TRANSACTION_SERVICE_PROXY = 'transactionServiceProxy';
  static ENTERPRISE_SERVICE_PROXY = 'enterpriseServiceProxy';
  static EACCOUNT_SERVICE_PROXY = 'eaccountSerivceProxy';
  static SALARY_PROJECT_SERVICE_PROXY = 'salaryProjectProxy';

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
          inject: [
            LoggerService,
            UserRepository,
            BcryptService,
            ExceptionsService,
          ],
          provide: ServiceProxyModule.USER_SERVICE_PROXY,
          useFactory: (
            logger: LoggerService,
            repo: UserRepository,
            bcrypt: BcryptService,
            exc: ExceptionsService,
          ) => new ServiceProxy(new UserService(repo, logger, bcrypt, exc)),
        },
        {
          inject: [
            JwtService,
            UserRepository,
            BcryptService,
            ExceptionsService,
          ],
          provide: ServiceProxyModule.AUTH_SERVICE_PROXY,
          useFactory: (
            jwtService: JwtService,
            repo: UserRepository,
            bcrypt: BcryptService,
            exc: ExceptionsService,
          ) => new ServiceProxy(new AuthService(jwtService, repo, bcrypt, exc)),
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
          inject: [
            UnitOfWorkService,
            AccountRepository,
            EAccountRepository,
            TransactionRepository,
            SalaryProjectRepository,
            ExceptionsService,
            LoggerService,
          ],
          provide: ServiceProxyModule.TRANSACTION_SERVICE_PROXY,
          useFactory: (
            uow: UnitOfWorkService,
            accountRepo: AccountRepository,
            eaccountRepo: EAccountRepository,
            transactionRepo: TransactionRepository,
            salaryRepo: SalaryProjectRepository,
            exc: ExceptionsService,
            logger: LoggerService,
          ) =>
            new ServiceProxy(
              new TransactionService(
                uow,
                accountRepo,
                eaccountRepo,
                transactionRepo,
                salaryRepo,
                exc,
                logger,
              ),
            ),
        },
        {
          inject: [BankRepository, EnterpriseRepository, UserRepository],
          provide: ServiceProxyModule.ENTERPRISE_SERVICE_PROXY,
          useFactory: (
            bankRepo: BankRepository,
            enterRepo: EnterpriseRepository,
            userRepo: UserRepository,
          ) =>
            new ServiceProxy(
              new EnterpriseService(enterRepo, bankRepo, userRepo),
            ),
        },
        {
          inject: [
            EAccountRepository,
            BankRepository,
            EnterpriseRepository,
            IBANgenerator,
          ],
          provide: ServiceProxyModule.EACCOUNT_SERVICE_PROXY,
          useFactory: (
            repo1: EAccountRepository,
            repo2: BankRepository,
            repo3: EnterpriseRepository,
            iban: IBANgenerator,
          ) => new ServiceProxy(new EAccountService(repo1, repo2, repo3, iban)),
        },
        {
          inject: [
            SalaryProjectRepository,
            EnterpriseRepository,
            ExceptionsService,
          ],
          provide: ServiceProxyModule.SALARY_PROJECT_SERVICE_PROXY,
          useFactory: (
            repo1: SalaryProjectRepository,
            repo2: EnterpriseRepository,
            exc: ExceptionsService,
          ) => new ServiceProxy(new SalaryProjectService(repo1, repo2, exc)),
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
        ServiceProxyModule.EACCOUNT_SERVICE_PROXY,
        ServiceProxyModule.SALARY_PROJECT_SERVICE_PROXY,
      ],
    };
  }
}
