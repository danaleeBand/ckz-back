import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserWorkspace1713628904253 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_workspace" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INT NOT NULL,
        "workspace_id" INT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("workspace_id") REFERENCES "workspace" ("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_workspace"`);
  }
}
