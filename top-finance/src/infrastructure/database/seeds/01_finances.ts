import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Limpar tabela
  await knex('finances').del();

  // Inserir dados de exemplo
  await knex('finances').insert([
    {
      user_id: 1,
      valor: 1500.00,
      descricao: 'Salário do mês',
      is_deleted: false,
      created: new Date(),
      updated: new Date(),
    },
    {
      user_id: 1,
      valor: -150.50,
      descricao: 'Conta de luz',
      is_deleted: false,
      created: new Date(),
      updated: new Date(),
    },
    {
      user_id: 2,
      valor: 2500.00,
      descricao: 'Freelance projeto X',
      is_deleted: false,
      created: new Date(),
      updated: new Date(),
    },
    {
      user_id: 2,
      valor: -85.00,
      descricao: 'Supermercado',
      is_deleted: false,
      created: new Date(),
      updated: new Date(),
    },
    {
      user_id: 3,
      valor: 3000.00,
      descricao: 'Venda de produto',
      is_deleted: false,
      created: new Date(),
      updated: new Date(),
    },
  ]);
}
