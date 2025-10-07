import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('nome', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('rua', 255).notNullable();
    table.string('numero', 50).notNullable();
    table.string('bairro', 255).notNullable();
    table.string('complemento', 255);
    table.string('cidade', 255).notNullable();
    table.string('estado', 2).notNullable();
    table.string('cep', 10).notNullable();
    table.enum('status', ['ativo', 'inativo']).notNullable().defaultTo('ativo');
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted').nullable();

    table.index(['email']);
    table.index(['is_deleted']);
    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
