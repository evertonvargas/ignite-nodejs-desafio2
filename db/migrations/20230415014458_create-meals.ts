import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    // eslint-disable-next-line no-unused-expressions
    table.uuid('id').primary()
    table.uuid('session_id').index()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.timestamp('date').notNullable()
    table.timestamp('time').notNullable()
    table.boolean('isDiet').notNullable().index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
