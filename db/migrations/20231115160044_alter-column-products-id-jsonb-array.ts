import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('marketlist', (table) => {
    table.dropColumn('products_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('marketlist', (table) => {
    table.dropColumn('products_id')
  })
}
