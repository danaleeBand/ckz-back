import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterChecklistTable1723717561735 implements MigrationInterface {
  name = 'AlterChecklistTable1723717561735';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "checklist" ALTER COLUMN "item_order" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "checklist" ALTER COLUMN "item_order" SET DEFAULT \'{}\'',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "checklist" ALTER COLUMN "item_order" DROP DEFAULT',
    );
    await queryRunner.query(
      'ALTER TABLE "checklist" ALTER COLUMN "item_order" DROP NOT NULL',
    );
  }
}
