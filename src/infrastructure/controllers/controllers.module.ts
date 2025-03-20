import { Module } from '@nestjs/common';
import { ServiceProxyModule } from '../service-proxy/service-proxy.module';
import { BankController } from './bank.controller';
import { UserController } from './user.controller';
import { AuthController } from './auth.controller';
import { ProfileController } from './profile.controller';
import { AccountController } from './account.controller';
import { TransactionController } from './transaction.controller';
import { EnterpriseController } from './enterprise.controller';

@Module({
  imports: [ServiceProxyModule.register()],
  controllers: [BankController, UserController, AuthController, ProfileController, AccountController, TransactionController, EnterpriseController],
})
export class ControllersModule {}