import { Module} from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ServiceProxyModule } from './infrastructure/service-proxy/service-proxy.module';
import { LoggerModule } from './infrastructure/middleware/logger/logger.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtModule as JwtServiceModule} from './infrastructure/services/jwt/jwt.module'
import { JwtStrategy } from './infrastructure/common/strategies/jwt.strategy';
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypt.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'key',
    }),
    DatabaseModule,
    LoggerModule,
    ControllersModule,
    ServiceProxyModule.register(),
    JwtServiceModule,
    BcryptModule
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
