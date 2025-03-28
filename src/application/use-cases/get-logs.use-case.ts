import { promises as fs } from 'fs';
import * as path from 'path';
import { IException } from 'src/domain/interfaces/exceptions.interface';

export class GetLogsUseCase {
  private logFilePath: string;

  constructor(private readonly exception: IException) {
    this.logFilePath = path.resolve(process.cwd(), 'logs', 'app.log');
  }

  async execute(): Promise<string[]> {
    try {
      const data = await fs.readFile(this.logFilePath, 'utf-8');
      return data.split('\n').filter(line => line.trim() !== '');
    } catch (error) {
      this.exception.internalServerErrorException({
        message: `Error during reading logs: ${error}`,
      });
      return [];
    }
  }
}
