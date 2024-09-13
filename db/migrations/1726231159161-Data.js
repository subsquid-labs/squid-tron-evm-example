module.exports = class Data1726231159161 {
    name = 'Data1726231159161'

    async up(db) {
        await db.query(`CREATE TABLE "usdt_transfer" ("id" character varying NOT NULL, "block" integer NOT NULL, "timestamp" numeric NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "value" numeric NOT NULL, "tx_hash" text NOT NULL, CONSTRAINT "PK_d545cc85c54a5b6ed87a8247f66" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_19cc1de618b4fcfd8d17e76b32" ON "usdt_transfer" ("block") `)
        await db.query(`CREATE INDEX "IDX_83250fde9d10ebfda8f532befe" ON "usdt_transfer" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_ac4b8a0800933c6e7e430e1636" ON "usdt_transfer" ("from") `)
        await db.query(`CREATE INDEX "IDX_ed8b070dde5108ca43164fe1b8" ON "usdt_transfer" ("to") `)
        await db.query(`CREATE INDEX "IDX_73692f9c3ca8e5cd939cdcd202" ON "usdt_transfer" ("tx_hash") `)
        await db.query(`CREATE TABLE "trx_burn" ("id" character varying NOT NULL, "block" integer NOT NULL, "timestamp" numeric NOT NULL, "address" text NOT NULL, "value" numeric NOT NULL, "tx_hash" text NOT NULL, CONSTRAINT "PK_21b21037a13fa713cc8ab46dd5a" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_4a4ef89852148bca52add33b57" ON "trx_burn" ("block") `)
        await db.query(`CREATE INDEX "IDX_53e21ab16d8772865273e01024" ON "trx_burn" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_56bb65a807c849c225c05205ee" ON "trx_burn" ("address") `)
        await db.query(`CREATE INDEX "IDX_c0337acd8072229c2fc4f70878" ON "trx_burn" ("tx_hash") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "usdt_transfer"`)
        await db.query(`DROP INDEX "public"."IDX_19cc1de618b4fcfd8d17e76b32"`)
        await db.query(`DROP INDEX "public"."IDX_83250fde9d10ebfda8f532befe"`)
        await db.query(`DROP INDEX "public"."IDX_ac4b8a0800933c6e7e430e1636"`)
        await db.query(`DROP INDEX "public"."IDX_ed8b070dde5108ca43164fe1b8"`)
        await db.query(`DROP INDEX "public"."IDX_73692f9c3ca8e5cd939cdcd202"`)
        await db.query(`DROP TABLE "trx_burn"`)
        await db.query(`DROP INDEX "public"."IDX_4a4ef89852148bca52add33b57"`)
        await db.query(`DROP INDEX "public"."IDX_53e21ab16d8772865273e01024"`)
        await db.query(`DROP INDEX "public"."IDX_56bb65a807c849c225c05205ee"`)
        await db.query(`DROP INDEX "public"."IDX_c0337acd8072229c2fc4f70878"`)
    }
}
