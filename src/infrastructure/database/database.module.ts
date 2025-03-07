import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankRepository } from './repositories/bank.repository.impl';
import { BankModel } from './models/bank.model';

@Module({
    imports: [TypeOrmModule.forFeature([BankModel])],
    providers: [BankRepository],
    exports: [BankRepository],
})
export class DatabaseModule {}
