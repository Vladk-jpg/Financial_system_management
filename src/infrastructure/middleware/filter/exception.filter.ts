// exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LoggerService } from '../logger/logger.service';

interface IError {
  message: string;
  code_error: string | null;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;
      
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as IError)
        : { message: (exception as Error).message, code_error: null };

    const responseData = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...message,
    };

    this.logMessage(request, message, status, exception);
    response.status(status).send(responseData);
  }

  private logMessage(
    request: FastifyRequest, 
    message: IError, 
    status: number, 
    exception: any
  ) {
    const logString = `${request.method} ${request.url} ${status}` +
      ` ${message.code_error} ${message.message}"`;

    if (status >= 500) {
      this.logger.error(logString);
    } else {
      this.logger.warn(logString);
    }
  }
}
