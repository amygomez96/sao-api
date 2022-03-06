import {MigrationInterface, QueryRunner} from "typeorm";

export class init1646450032452 implements MigrationInterface {
    name = 'init1646450032452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL DEFAULT 'student', "description" character varying, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(50), "last_name" character varying, "username" character varying(50) NOT NULL, "email" character varying(100), "password" character varying, "phone" character varying, "optional" character varying, "faculty" integer, "created_at" TIMESTAMP NOT NULL DEFAULT '"2022-03-05T03:13:52.726Z"', "deleted_at" TIMESTAMP, "roleId" integer, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "optative" ("id" SERIAL NOT NULL, "name" character varying(50), "classroom" character varying, "professorId" integer, CONSTRAINT "PK_b7d9802716c1764a386587959ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "requests" ("id" SERIAL NOT NULL, "studentId" integer, "optativeId" integer, CONSTRAINT "PK_0428f484e96f9e6a55955f29b5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "optative" ADD CONSTRAINT "FK_270d1ea80a2cd54e6b0271ab048" FOREIGN KEY ("professorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_27a1bf5612816833562ae59f6f2" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_3bbaeaf611973ae3df63db72df1" FOREIGN KEY ("optativeId") REFERENCES "optative"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_3bbaeaf611973ae3df63db72df1"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_27a1bf5612816833562ae59f6f2"`);
        await queryRunner.query(`ALTER TABLE "optative" DROP CONSTRAINT "FK_270d1ea80a2cd54e6b0271ab048"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`DROP TABLE "requests"`);
        await queryRunner.query(`DROP TABLE "optative"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
