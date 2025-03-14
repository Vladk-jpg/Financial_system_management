import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankModel } from './models/bank.model';
import { BankRepository } from './repositories/bank.repository.impl';
import { UserModel } from './models/user.model';
import { UserRepository } from './repositories/user.repository.impl';

@Global() 
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [BankModel, UserModel],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([BankModel, UserModel]),
  ],
  providers: [BankRepository, UserRepository],
  exports: [TypeOrmModule, BankRepository, UserRepository],
})
export class DatabaseModule {}
