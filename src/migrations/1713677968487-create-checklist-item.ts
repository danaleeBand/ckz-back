import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChecklistItem1713677968487 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "checklist_item" (
        "id" SERIAL PRIMARY KEY,
        "checklist_id" INT NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "memo" VARCHAR(255) NOT NULL,
        "image_url" VARCHAR(255),
        "is_checked" BOOLEAN NOT NULL DEFAULT false,
        "checked_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("checklist_id") REFERENCES "checklist" ("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "checklist_item"');
  }
}
