import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('finances', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.decimal('valor', 15, 2).notNullable();
    table.string('descricao', 500).notNullable();
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted').nullable();

    table.index(['user_id']);
    table.index(['is_deleted']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('finances');
}
