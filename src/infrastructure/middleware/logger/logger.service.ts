import { Injectable, Logger } from '@nestjs/common';
import { ILogger } from '../../../domain/logger/logger.interface';

@Injectable()
export class LoggerService extends Logger implements ILogger {
  debug(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.debug(`${message}`, context);
    }
  }

  log(message: string, context?: string) {
    super.log(`${message}`, context || 'AppLogger');
  }

  error(message: string, trace?: string, context?: string) {
    super.error(`${message}`, trace, context || 'AppLogger');
  }

  warn(message: string, context?: string) {
    super.warn(`${message}`, context || 'AppLogger');
  }

  verbose(message: string, context?: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.verbose(`${message}`, context || 'AppLogger');
    }
  }
}
