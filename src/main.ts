import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './infrastructure/middleware/filter/exception.filter';
import { LoggerService } from './infrastructure/middleware/logger/logger.service';
import { LoggingInterceptor } from './infrastructure/middleware/interceptors/logger.interceptor';
import { ResponseInterceptor } from './infrastructure/middleware/interceptors/response.interceptor';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors();

  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(3000);
  console.log('🚀 Server started on http://localhost:3000');
}

bootstrap();
