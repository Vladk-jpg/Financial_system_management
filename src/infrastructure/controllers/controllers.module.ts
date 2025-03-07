import { Module } from '@nestjs/common';
import { ServiceProxyModule } from '../service-proxy/service-proxy.module';
import { BankController } from './bank/bank.controller';

@Module({
  imports: [ServiceProxyModule.register()],
  controllers: [BankController],
})
export class ControllersModule {}