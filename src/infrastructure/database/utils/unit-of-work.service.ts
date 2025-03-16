import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';  
import { IUnitOfWork } from 'src/domain/interfaces/unit-of-work.interface';

@Injectable()
export class UnitOfWorkService implements IUnitOfWork {
  private readonly dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async begin(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    this.dataSource['queryRunner'] = queryRunner;
  }

  async commit(): Promise<void> {
    const queryRunner = this.dataSource['queryRunner'];
    if (queryRunner) {
      await queryRunner.commitTransaction();
      await queryRunner.release();
    }
  }

  async rollback(): Promise<void> {
    const queryRunner = this.dataSource['queryRunner'];
    if (queryRunner) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
    }
  }
}
