import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCheklist1713633949678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "checklist" (
        "id" SERIAL PRIMARY KEY,
        "folder_id" INT NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "item_order" INT[] NOT NULL DEFAULT '{}'::INT[],
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("folder_id") REFERENCES "folder" ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "checklist"');
  }
}
