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

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [BankModel, UserModel, AccountModel, TransactionModel],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      BankModel,
      UserModel,
      AccountModel,
      TransactionModel,
    ]),
  ],
  providers: [
    BankRepository,
    UserRepository,
    UnitOfWorkService,
    AccountRepository,
    TransactionRepository,
  ],
  exports: [
    TypeOrmModule,
    BankRepository,
    UserRepository,
    UnitOfWorkService,
    AccountRepository,
    TransactionRepository,
  ],
})
export class DatabaseModule {}
