import { Injectable, Logger } from '@nestjs/common';
import { ILogger } from '../../../domain/logger/logger.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService extends Logger implements ILogger {
  private logFilePath: string;

  constructor() {
    super();
    this.logFilePath = path.join(__dirname, '../../../../logs/app.log');
  }

  private writeToFile(
    level: string,
    message: string,
    context?: string,
    trace?: string,
  ) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${context || 'AppLogger'}] ${message} ${
      trace ? '\n' + trace : ''
    }\n`;

    fs.appendFile(this.logFilePath, logMessage, (err) => {
      if (err) console.error('Ошибка записи лога:', err);
    });
  }

  debug(message: string, context?: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.debug(`${message}`, context);
      this.writeToFile('debug', message, context);
    }
  }

  log(message: string, context?: string) {
    super.log(`${message}`, context || 'AppLogger');
    this.writeToFile('info', message, context);
  }

  error(message: string, trace?: string, context?: string) {
    super.error(`${message}`, trace, context || 'AppLogger');
    this.writeToFile('error', message, context, trace);
  }

  warn(message: string, context?: string) {
    super.warn(`${message}`, context || 'AppLogger');
    this.writeToFile('warn', message, context);
  }

  verbose(message: string, context?: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.verbose(`${message}`, context || 'AppLogger');
      this.writeToFile('verbose', message, context);
    }
  }
}
