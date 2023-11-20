import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('marketlist', (table) => {
    table.uuid('products_id').unsigned()
    table.foreign('products_id').references('id').inTable('products')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('marketlist', (table) => {
    table.dropForeign(['products_id'])
    table.dropColumn('products_id')
  })
}
