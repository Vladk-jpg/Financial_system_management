import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { IUnitOfWork } from 'src/domain/interfaces/unit-of-work.interface';

@Injectable()
export class UnitOfWorkService implements IUnitOfWork {
  private queryRunner!: QueryRunner;

  constructor(private readonly dataSource: DataSource) {}

  async begin(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commit(): Promise<void> {
    await this.queryRunner.commitTransaction();
    await this.queryRunner.release();
  }

  async rollback(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
  }

  getManager<T>(): T {
    return this.queryRunner.manager as unknown as T;
  }
}
