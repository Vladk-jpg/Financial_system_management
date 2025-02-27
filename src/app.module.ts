import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankEntity } from './infrastructure/database/entities/bank.entity';
import { BankController } from './api/bank/bank.controller';
import { ApplicationModule } from './application/application.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { LoggingMiddleware } from './infrastructure/middleware/logging.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',                    
      database: 'database.sqlite',      
      entities: [BankEntity],          
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
