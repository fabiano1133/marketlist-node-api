import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lists_products', (table) => {
    table.uuid('id').primary()
    table.uuid('list_id').references('marketlist.id')
    table.uuid('product_id').references('products.id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('lists_products')
}
