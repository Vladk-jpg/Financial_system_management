import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankRepository } from './repositories/bank.repository.impl';
import { BankModel } from './models/bank.model';
import { BANK_REPOSITORY } from 'src/domain/interfaces/bank.repository';

@Module({
    imports: [TypeOrmModule.forFeature([BankModel])],
    providers: [
        {
            provide: BANK_REPOSITORY,
            useClass: BankRepository, 
        },
    ],
    exports: [BANK_REPOSITORY],
})
export class DatabaseModule {}
