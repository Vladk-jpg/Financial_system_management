import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankModel } from './infrastructure/database/models/bank.model';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ServiceProxyModule } from './infrastructure/service-proxy/service-proxy.module';
import { LoggerModule } from './infrastructure/middleware/logger/logger.module';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [BankModel],
      synchronize: true,
    }),
    LoggerModule,
    ExceptionsModule,
    DatabaseModule,
    ControllersModule,
    ServiceProxyModule.register(),
  ],
})
export class AppModule {}
