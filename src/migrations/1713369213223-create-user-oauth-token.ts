import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserOauthToken1713369213223 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE provider_enum AS ENUM ('kakao', 'google');

      CREATE TABLE "social_login" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INT NOT NULL,
        "provider" provider_enum NOT NULL,
        "provider_id" VARCHAR(25) NOT NULL,
        "id_token" VARCHAR(1000) NOT NULL,
        "access_token" VARCHAR(255) NOT NULL,
        "refresh_token" VARCHAR(255) NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "FK_social_login_user" FOREIGN KEY ("user_id") REFERENCES "user" ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
