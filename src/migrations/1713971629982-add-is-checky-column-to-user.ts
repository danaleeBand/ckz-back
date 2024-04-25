import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsCheckyColumnToUser1713971629982
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" ADD "is_checky" BOOLEAN DEFAULT false;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" DROP COLUMN "is_checky";
    `);
  }
}
