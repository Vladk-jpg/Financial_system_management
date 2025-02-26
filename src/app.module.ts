import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { LoggingMiddleware } from './infrastructure/middleware/logging.middleware';

@Module({
  imports: [AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
