import { Module } from '@nestjs/common';
import { BankService } from './services/bank.service'
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [BankService], 
    exports: [BankService],
})
export class ApplicationModule {}
