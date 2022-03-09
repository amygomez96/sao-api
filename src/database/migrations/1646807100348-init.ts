import {MigrationInterface, QueryRunner} from "typeorm";

export class init1646807100348 implements MigrationInterface {
    name = 'init1646807100348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "optional" TO "optionalId"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '"2022-03-09T06:25:00.647Z"'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "optionalId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "optionalId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_f7505403e759c3bc4a23fd7f164" FOREIGN KEY ("optionalId") REFERENCES "optative"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f7505403e759c3bc4a23fd7f164"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "optionalId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "optionalId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2022-03-05 03:13:52.726'`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "optionalId" TO "optional"`);
    }

}
