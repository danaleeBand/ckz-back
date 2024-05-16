import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameUserWorkspaceTable1715456805571 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_workspace RENAME TO workspace_user`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE workspace_user RENAME TO user_workspace`,
    );
  }
}
