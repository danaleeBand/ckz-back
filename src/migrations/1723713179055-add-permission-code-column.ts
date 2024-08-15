import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPermissionCodeColumn1723713179055
  implements MigrationInterface
{
  name = 'AddPermissionCodeColumn1723713179055';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "workspace" ADD "permission_code" character varying NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "folder" ADD "permission_code" character varying NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "checklist" ADD "permission_code" character varying NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "checklist_item" ADD "permission_code" character varying NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "permission" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()',
    );
    await queryRunner.query(
      'ALTER TABLE "permission" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "permission" DROP COLUMN "updated_at"',
    );
    await queryRunner.query(
      'ALTER TABLE "permission" DROP COLUMN "created_at"',
    );
    await queryRunner.query(
      'ALTER TABLE "checklist_item" DROP COLUMN "permission_code"',
    );
    await queryRunner.query(
      'ALTER TABLE "checklist" DROP COLUMN "permission_code"',
    );
    await queryRunner.query(
      'ALTER TABLE "folder" DROP COLUMN "permission_code"',
    );
    await queryRunner.query(
      'ALTER TABLE "workspace" DROP COLUMN "permission_code"',
    );
  }
}
