import { Module} from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ServiceProxyModule } from './infrastructure/service-proxy/service-proxy.module';
import { LoggerModule } from './infrastructure/middleware/logger/logger.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    ControllersModule,
    ServiceProxyModule.register(),
  ],
})
export class AppModule {}
