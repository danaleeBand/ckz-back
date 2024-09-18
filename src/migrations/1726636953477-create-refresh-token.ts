import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshToken1726636953477 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_token" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "refresh_token" character varying(255) NOT NULL, 
                "expires_at" TIMESTAMP NOT NULL, 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_refresh_token_id" PRIMARY KEY ("id"), 
                CONSTRAINT "FK_user_refresh_token" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
            )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "refresh_token"');
  }
}
