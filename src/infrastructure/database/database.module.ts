import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankModel } from './models/bank.model';
import { BankRepository } from './repositories/bank.repository.impl';
import { UserModel } from './models/user.model';
import { UserRepository } from './repositories/user.repository.impl';
import { AccountModel } from './models/account.model';
import { UnitOfWorkService } from './utils/unit-of-work.service';
import { AccountRepository } from './repositories/account.repository.impl';
import { TransactionModel } from './models/transaction.model';
import { TransactionRepository } from './repositories/transaction.repository.impl';
import { EnterpriseModel } from './models/enterprise.model';
import { EnterpriseRepository } from './repositories/enterprise.repository.impl';
import { EAccountModel } from './models/e-account.model';
import { EAccountRepository } from './repositories/e-account.repository.impl';
import { SalaryProjectModel } from './models/salary-project.model';
import { EmployeeModel } from './models/employee.model';
import { SalaryProjectRepository } from './repositories/salary-project.repository.impl';
import { LoanModel } from './models/loan.model';
import { LoanRepository } from './repositories/loan.repository.impl';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [
        BankModel,
        UserModel,
        AccountModel,
        TransactionModel,
        EnterpriseModel,
        EAccountModel,
        SalaryProjectModel,
        EmployeeModel,
        LoanModel,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      BankModel,
      UserModel,
      AccountModel,
      TransactionModel,
      EnterpriseModel,
      EAccountModel,
      SalaryProjectModel,
      EmployeeModel,
      LoanModel,
    ]),
  ],
  providers: [
    BankRepository,
    UserRepository,
    UnitOfWorkService,
    AccountRepository,
    TransactionRepository,
    EnterpriseRepository,
    EAccountRepository,
    SalaryProjectRepository,
    LoanRepository,
  ],
  exports: [
    TypeOrmModule,
    BankRepository,
    UserRepository,
    UnitOfWorkService,
    AccountRepository,
    TransactionRepository,
    EnterpriseRepository,
    EAccountRepository,
    SalaryProjectRepository,
    LoanRepository,
  ],
})
export class DatabaseModule {}
