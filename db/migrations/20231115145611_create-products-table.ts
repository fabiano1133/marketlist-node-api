import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.integer('quantity').notNullable()
    table.uuid('marketlist_id').unsigned()
    table.foreign('marketlist_id').references('id').inTable('marketlist')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products')
}
