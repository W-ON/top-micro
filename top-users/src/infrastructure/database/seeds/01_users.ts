import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Limpar tabela
  await knex('users').del();

  // Inserir dados de exemplo
  await knex('users').insert([
    {
      nome: 'João Silva',
      email: 'joao.silva@example.com',
      rua: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      complemento: 'Apto 101',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      status: 'ativo',
      is_deleted: false,
      created: new Date(),
      updated: new Date(),
    },
    {
      nome: 'Maria Santos',
      email: 'maria.santos@example.com',
      rua: 'Av. Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      complemento: '',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100',
      status: 'ativo',
      is_deleted: false,
      created: new Date(),
      updated: new Date(),
    },
    {
      nome: 'Pedro Oliveira',
      email: 'pedro.oliveira@example.com',
      rua: 'Rua Augusta',
      numero: '500',
      bairro: 'Consolação',
      complemento: 'Sala 5',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01305-000',
      status: 'inativo',
      is_deleted: false,
      created: new Date(),
      updated: new Date(),
    },
  ]);
}
