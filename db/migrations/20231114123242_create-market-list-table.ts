import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('marketlist', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.boolean('isDone').defaultTo('false')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('marketlist')
}
