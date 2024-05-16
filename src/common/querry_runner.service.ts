import { Injectable } from '@nestjs/common';
import { Connection, QueryRunner } from 'typeorm';

@Injectable()
export class QueryRunnerService {
  private queryRunner: QueryRunner;

  constructor(private readonly connection: Connection) {}

  getQueryRunner(): QueryRunner {
    if (!this.queryRunner) {
      this.queryRunner = this.connection.createQueryRunner();
    }
    return this.queryRunner;
  }

  async startTransaction(): Promise<void> {
    const queryRunner = this.getQueryRunner();
    await queryRunner.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    const queryRunner = this.getQueryRunner();
    await queryRunner.commitTransaction();
    await this.releaseQueryRunner();
  }

  async rollbackTransaction(): Promise<void> {
    const queryRunner = this.getQueryRunner();
    await queryRunner.rollbackTransaction();
    await this.releaseQueryRunner();
  }

  async releaseQueryRunner(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.release();
      this.queryRunner = null;
    }
  }
}
