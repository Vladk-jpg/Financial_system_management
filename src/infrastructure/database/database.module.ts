import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankModel } from './models/bank.model';
import { BankRepository } from './repositories/bank.repository.impl';

@Global() 
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [BankModel],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([BankModel]),
  ],
  providers: [BankRepository],
  exports: [TypeOrmModule, BankRepository],
})
export class DatabaseModule {}
