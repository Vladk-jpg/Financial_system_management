import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankModel } from './models/bank.model';
import { BankRepository } from './repositories/bank.repository.impl';
import { UserModel } from './models/user.model';
import { UserRepository } from './repositories/user.repository.impl';
import { AccountModel } from './models/account.model';
import { UnitOfWorkService } from './utils/unit-of-work.service';
import { AccountRepository } from './repositories/account.repository.impl';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [BankModel, UserModel, AccountModel],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([BankModel, UserModel, AccountModel]),
  ],
  providers: [
    BankRepository,
    UserRepository,
    UnitOfWorkService,
    AccountRepository,
  ],
  exports: [
    TypeOrmModule,
    BankRepository,
    UserRepository,
    UnitOfWorkService,
    AccountRepository,
  ],
})
export class DatabaseModule {}
