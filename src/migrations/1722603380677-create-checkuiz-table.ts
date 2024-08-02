import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCheckuizTable1722603380677 implements MigrationInterface {
  name = 'CreateCheckuizTable1722603380677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "profile_image_url" character varying, "is_checky" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TYPE "public"."auth_provider_enum" AS ENUM(\'kakao\', \'google\')',
    );
    await queryRunner.query(
      'CREATE TABLE "auth" ("id" SERIAL NOT NULL, "provider_user_id" character varying(25) NOT NULL, "provider" "public"."auth_provider_enum" NOT NULL, "access_token" character varying(255) NOT NULL, "refresh_token" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_9922406dc7d70e20423aeffadf" UNIQUE ("user_id"), CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "workspace" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "folder_order" integer array NOT NULL DEFAULT \'{}\', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "workspace_user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "workspace_id" integer, CONSTRAINT "PK_a09cff0ab849da007d391eb9284" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "folder" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "checklist_order" integer array NOT NULL DEFAULT \'{}\', "is_default" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "workspace_id" integer, CONSTRAINT "PK_6278a41a706740c94c02e288df8" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "checklist" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "item_order" integer array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "folder_id" integer, CONSTRAINT "PK_e4b437f5107f2a9d5b744d4eb4c" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "checklist_item" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "memo" character varying NOT NULL, "image_url" character varying, "is_checked" boolean NOT NULL DEFAULT false, "checked_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "checklist_id" integer, CONSTRAINT "PK_0c52d9590c766a9ae718e16cebf" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "permission" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "user_id" integer, CONSTRAINT "REL_8ec1323d871577a8795e54c9c4" UNIQUE ("user_id"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'ALTER TABLE "auth" ADD CONSTRAINT "FK_9922406dc7d70e20423aeffadf3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_cb830469656d51ce772872fc9d0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_b312f71c6b1049d0455261f39dc" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "folder" ADD CONSTRAINT "FK_677015b1100b1ff823343b931d9" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "checklist" ADD CONSTRAINT "FK_385df1327952462df9fa06ccdd3" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "checklist_item" ADD CONSTRAINT "FK_71320403ee3eaf922ea7e114fa6" FOREIGN KEY ("checklist_id") REFERENCES "checklist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "permission" ADD CONSTRAINT "FK_8ec1323d871577a8795e54c9c4b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "permission" DROP CONSTRAINT "FK_8ec1323d871577a8795e54c9c4b"',
    );
    await queryRunner.query(
      'ALTER TABLE "checklist_item" DROP CONSTRAINT "FK_71320403ee3eaf922ea7e114fa6"',
    );
    await queryRunner.query(
      'ALTER TABLE "checklist" DROP CONSTRAINT "FK_385df1327952462df9fa06ccdd3"',
    );
    await queryRunner.query(
      'ALTER TABLE "folder" DROP CONSTRAINT "FK_677015b1100b1ff823343b931d9"',
    );
    await queryRunner.query(
      'ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_b312f71c6b1049d0455261f39dc"',
    );
    await queryRunner.query(
      'ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_cb830469656d51ce772872fc9d0"',
    );
    await queryRunner.query(
      'ALTER TABLE "auth" DROP CONSTRAINT "FK_9922406dc7d70e20423aeffadf3"',
    );
    await queryRunner.query('DROP TABLE "permission"');
    await queryRunner.query('DROP TABLE "checklist_item"');
    await queryRunner.query('DROP TABLE "checklist"');
    await queryRunner.query('DROP TABLE "folder"');
    await queryRunner.query('DROP TABLE "workspace_user"');
    await queryRunner.query('DROP TABLE "workspace"');
    await queryRunner.query('DROP TABLE "auth"');
    await queryRunner.query('DROP TYPE "public"."auth_provider_enum"');
    await queryRunner.query('DROP TABLE "user"');
  }
}
