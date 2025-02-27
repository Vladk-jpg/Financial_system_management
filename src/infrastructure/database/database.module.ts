import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankRepository } from './repositories/bank.repository.impl';
import { BankEntity } from './entities/bank.entity';
import { BANK_REPOSITORY } from 'src/domain/interfaces/bank.repository';

@Module({
    imports: [TypeOrmModule.forFeature([BankEntity])],
    providers: [
        {
            provide: BANK_REPOSITORY,
            useClass: BankRepository, // Здесь уже есть реализация
        },
    ],
    exports: [BANK_REPOSITORY],
})
export class DatabaseModule {}
