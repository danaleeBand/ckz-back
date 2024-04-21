import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuth1713369213223 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE provider_enum AS ENUM ('kakao', 'google');

      CREATE TABLE "auth" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INT NOT NULL,
        "provider_user_id" VARCHAR(25) NOT NULL,
        "provider" provider_enum NOT NULL,
        "access_token" VARCHAR(255) NOT NULL,
        "refresh_token" VARCHAR(255) NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "auth" DROP CONSTRAINT "FK_auth_user_id";
    `);

    // "auth" 테이블 삭제
    await queryRunner.query(`
        DROP TABLE "auth";
    `);

    // "provider_enum" 타입 삭제
    await queryRunner.query(`
      DROP TYPE "provider_enum";
    `);
  }
}
