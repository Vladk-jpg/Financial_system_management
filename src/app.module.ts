import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankModel } from './infrastructure/database/models/bank.model';
import { BankController } from './api/bank/bank.controller';
import { ApplicationModule } from './application/application.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { LoggingMiddleware } from './infrastructure/middleware/logging.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',                    
      database: 'database.sqlite',      
      entities: [BankModel],          
      synchronize: true,             
  }),
    DatabaseModule,
    ApplicationModule,
  ],
  controllers: [BankController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
