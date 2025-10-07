import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { Transport, ClientProxy, ClientsModule } from '@nestjs/microservices';
import { FinanceModule } from '../src/finance.module';
import { firstValueFrom } from 'rxjs';

describe('Finance Microservice (e2e)', () => {
  let app: INestMicroservice;
  let client: ClientProxy;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        FinanceModule,
        ClientsModule.register([
          {
            name: 'FINANCE_SERVICE',
            transport: Transport.TCP,
            options: {
              host: '127.0.0.1',
              port: 4098,
            },
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 4098,
      },
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.listen();

    client = moduleFixture.get('FINANCE_SERVICE');
    await client.connect();
  });

  afterAll(async () => {
    await client.close();
    await app.close();
  });

  describe('create_finance', () => {
    it('deve criar uma finança com sucesso', async () => {
      const dto = {
        user_id: 1,
        valor: 1500.50,
        descricao: 'Salário do mês',
      };

      const response = await firstValueFrom(
        client.send({ cmd: 'create_finance' }, dto),
      );

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('id');
      expect(response.data.user_id).toBe(dto.user_id);
      expect(response.data.valor).toBe(dto.valor);
      expect(response.data.descricao).toBe(dto.descricao);
    });

    it('deve retornar erro ao criar finança com user_id inválido', async () => {
      const dto = {
        user_id: 0,
        valor: 100,
        descricao: 'Teste',
      };

      const response = await firstValueFrom(
        client.send({ cmd: 'create_finance' }, dto),
      );

      expect(response.success).toBe(false);
    });

    it('deve retornar erro ao criar finança sem descrição', async () => {
      const dto = {
        user_id: 1,
        valor: 100,
        descricao: '',
      };

      const response = await firstValueFrom(
        client.send({ cmd: 'create_finance' }, dto),
      );

      expect(response.success).toBe(false);
    });

    it('deve criar finança com valor negativo (despesa)', async () => {
      const dto = {
        user_id: 1,
        valor: -250.75,
        descricao: 'Conta de luz',
      };

      const response = await firstValueFrom(
        client.send({ cmd: 'create_finance' }, dto),
      );

      expect(response.success).toBe(true);
      expect(response.data.valor).toBe(dto.valor);
    });
  });

  describe('list_finances', () => {
    it('deve listar finanças', async () => {
      const response = await firstValueFrom(
        client.send({ cmd: 'list_finances' }, { includeDeleted: false }),
      );

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('get_finance', () => {
    it('deve buscar finança por ID', async () => {
      // Criar finança
      const createDto = {
        user_id: 2,
        valor: 750.00,
        descricao: 'Freelance',
      };

      const createResponse = await firstValueFrom(
        client.send({ cmd: 'create_finance' }, createDto),
      );

      const financeId = createResponse.data.id;

      // Buscar finança
      const response = await firstValueFrom(
        client.send({ cmd: 'get_finance' }, { id: financeId }),
      );

      expect(response.success).toBe(true);
      expect(response.data.id).toBe(financeId);
      expect(response.data.descricao).toBe(createDto.descricao);
    });

    it('deve retornar erro ao buscar finança inexistente', async () => {
      const response = await firstValueFrom(
        client.send({ cmd: 'get_finance' }, { id: 99999 }),
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('não encontrada');
    });
  });

  describe('list_finances_by_user', () => {
    it('deve listar finanças de um usuário específico', async () => {
      const userId = 1;

      // Criar algumas finanças para o usuário
      await firstValueFrom(
        client.send({ cmd: 'create_finance' }, {
          user_id: userId,
          valor: 100,
          descricao: 'Teste 1',
        }),
      );

      await firstValueFrom(
        client.send({ cmd: 'create_finance' }, {
          user_id: userId,
          valor: 200,
          descricao: 'Teste 2',
        }),
      );

      // Listar finanças do usuário
      const response = await firstValueFrom(
        client.send({ cmd: 'list_finances_by_user' }, {
          userId,
          includeDeleted: false
        }),
      );

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);

      // Verificar se todas as finanças pertencem ao usuário
      response.data.forEach((finance: any) => {
        expect(finance.user_id).toBe(userId);
      });
    });

    it('deve retornar array vazio para usuário sem finanças', async () => {
      const response = await firstValueFrom(
        client.send({ cmd: 'list_finances_by_user' }, {
          userId: 99999,
          includeDeleted: false
        }),
      );

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBe(0);
    });
  });

  describe('update_finance', () => {
    it('deve atualizar finança com sucesso', async () => {
      // Criar finança
      const createDto = {
        user_id: 3,
        valor: 500.00,
        descricao: 'Descrição original',
      };

      const createResponse = await firstValueFrom(
        client.send({ cmd: 'create_finance' }, createDto),
      );

      const financeId = createResponse.data.id;

      // Atualizar finança
      const updateDto = {
        valor: 600.00,
        descricao: 'Descrição atualizada',
      };

      const response = await firstValueFrom(
        client.send({ cmd: 'update_finance' }, { id: financeId, dto: updateDto }),
      );

      expect(response.success).toBe(true);
      expect(response.data.valor).toBe(updateDto.valor);
      expect(response.data.descricao).toBe(updateDto.descricao);
    });

    it('deve atualizar apenas o valor', async () => {
      // Criar finança
      const createDto = {
        user_id: 3,
        valor: 300.00,
        descricao: 'Descrição fixa',
      };

      const createResponse = await firstValueFrom(
        client.send({ cmd: 'create_finance' }, createDto),
      );

      const financeId = createResponse.data.id;

      // Atualizar apenas valor
      const updateDto = {
        valor: 400.00,
      };

      const response = await firstValueFrom(
        client.send({ cmd: 'update_finance' }, { id: financeId, dto: updateDto }),
      );

      expect(response.success).toBe(true);
      expect(response.data.valor).toBe(updateDto.valor);
      expect(response.data.descricao).toBe(createDto.descricao);
    });

    it('deve retornar erro ao atualizar finança inexistente', async () => {
      const response = await firstValueFrom(
        client.send({ cmd: 'update_finance' }, {
          id: 99999,
          dto: { valor: 100 }
        }),
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('não encontrada');
    });
  });

  describe('delete_finance', () => {
    it('deve deletar finança com sucesso (soft delete)', async () => {
      // Criar finança
      const createDto = {
        user_id: 4,
        valor: 150.00,
        descricao: 'Finança para deletar',
      };

      const createResponse = await firstValueFrom(
        client.send({ cmd: 'create_finance' }, createDto),
      );

      const financeId = createResponse.data.id;

      // Deletar finança
      const deleteResponse = await firstValueFrom(
        client.send({ cmd: 'delete_finance' }, { id: financeId }),
      );

      expect(deleteResponse.success).toBe(true);

      // Verificar que não consegue mais buscar
      const getResponse = await firstValueFrom(
        client.send({ cmd: 'get_finance' }, { id: financeId }),
      );

      expect(getResponse.success).toBe(false);
    });

    it('deve retornar erro ao deletar finança inexistente', async () => {
      const response = await firstValueFrom(
        client.send({ cmd: 'delete_finance' }, { id: 99999 }),
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('não encontrada');
    });
  });

  describe('validações', () => {
    it('deve retornar erro ao criar finança com descrição muito longa', async () => {
      const dto = {
        user_id: 1,
        valor: 100,
        descricao: 'a'.repeat(501), // Mais de 500 caracteres
      };

      const response = await firstValueFrom(
        client.send({ cmd: 'create_finance' }, dto),
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('500 caracteres');
    });
  });
});
