import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1760713897089 implements MigrationInterface {
    name = 'InitialMigration1760713897089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" integer NOT NULL, "balance" numeric(12,2) NOT NULL DEFAULT '0', "interest" numeric(12,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(12,2), "description" character varying, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "reference" character varying, "type" character varying, "toWalletId" integer, "userId" integer, "targetSavingId" uuid, "walletId" uuid, CONSTRAINT "UQ_0b12a144bdc7678b6ddb0b913fc" UNIQUE ("reference"), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."target_saving_frequency_enum" AS ENUM('daily', 'weekly', 'monthly')`);
        await queryRunner.query(`CREATE TABLE "target_saving" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "targetAmount" numeric(15,2) NOT NULL, "frequency" "public"."target_saving_frequency_enum" NOT NULL, "preferredTime" character varying NOT NULL, "durationMonths" integer NOT NULL DEFAULT '0', "interestRate" numeric(5,2) NOT NULL DEFAULT '0', "currentAmount" numeric(15,2) NOT NULL DEFAULT '0', "isMatured" boolean NOT NULL DEFAULT false, "status" character varying NOT NULL DEFAULT 'Live', "maturityDate" TIMESTAMP, "collectedAmount" numeric(15,2) NOT NULL DEFAULT '0', "completed" boolean NOT NULL DEFAULT false, "contributions" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_9f2886cc1bad598c3a2b3b50765" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "timezone" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_1b296fd619fe5543ce401983cf2" FOREIGN KEY ("targetSavingId") REFERENCES "target_saving"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "target_saving" ADD CONSTRAINT "FK_ddba86357f99d3aace8bcd17e29" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target_saving" DROP CONSTRAINT "FK_ddba86357f99d3aace8bcd17e29"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_1b296fd619fe5543ce401983cf2"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "target_saving"`);
        await queryRunner.query(`DROP TYPE "public"."target_saving_frequency_enum"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
    }

}
