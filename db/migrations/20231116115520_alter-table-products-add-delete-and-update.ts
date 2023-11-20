import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.dropForeign('marketlist_id')
    table
      .foreign('marketlist_id')
      .references('marketlist.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.dropForeign('marketlist_id')
    table.foreign('marketlist_id').references('marketlist.id')
  })
}
