import { Module } from '@nestjs/common';
import { ServiceProxyModule } from '../service-proxy/service-proxy.module';
import { BankController } from './bank/bank.controller';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { ProfileController } from './profile/profile.controller';

@Module({
  imports: [ServiceProxyModule.register()],
  controllers: [BankController, UserController, AuthController, ProfileController],
})
export class ControllersModule {}