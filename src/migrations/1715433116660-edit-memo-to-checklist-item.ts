import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditMemoToChecklistItem1715433116660
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE checklist_item
            ALTER COLUMN memo DROP NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE checklist_item
            ALTER COLUMN memo SET NOT NULL;
        `);
  }
}
