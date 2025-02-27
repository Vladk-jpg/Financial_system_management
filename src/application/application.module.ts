import { Module } from '@nestjs/common';
import { CreateBankUseCase } from './use-cases/create-bank.use-case';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [CreateBankUseCase], 
    exports: [CreateBankUseCase],
})
export class ApplicationModule {}
