import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFolder1713629509672 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "folder" (
        "id" SERIAL PRIMARY KEY,
        "workspace_id" INT NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "checklist_order" INT[] NOT NULL DEFAULT '{}'::INT[],
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("workspace_id") REFERENCES "workspace" ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "folder"`);
  }
}
