import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsDefaultToFolder1715343575657 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE folder
        ADD COLUMN is_default BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE folder
        DROP COLUMN is_default;
    `);
  }
}
