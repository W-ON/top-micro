import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { Transport, ClientProxy, ClientsModule } from '@nestjs/microservices';
import { UsersModule } from '../src/users.module';
import { firstValueFrom } from 'rxjs';

describe('Users Microservice (e2e)', () => {
  let app: INestMicroservice;
  let client: ClientProxy;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        ClientsModule.register([
          {
            name: 'USER_SERVICE',
            transport: Transport.TCP,
            options: {
              host: '127.0.0.1',
              port: 4099,
            },
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 4099,
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

    client = moduleFixture.get('USER_SERVICE');
    await client.connect();
  });

  afterAll(async () => {
    await client.close();
    await app.close();
  });

  describe('create_user', () => {
    it('deve criar um usuário com sucesso', async () => {
      const dto = {
        nome: 'Test User',
        email: `test${Date.now()}@example.com`,
        rua: 'Rua Teste',
        numero: '100',
        bairro: 'Centro',
        complemento: '',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        status: 'ativo',
      };

      const response = await firstValueFrom(
        client.send({ cmd: 'create_user' }, dto),
      );

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('id');
      expect(response.data.nome).toBe(dto.nome);
      expect(response.data.email).toBe(dto.email);
    });

    it('deve retornar erro ao criar usuário com email duplicado', async () => {
      const email = `duplicate${Date.now()}@example.com`;

      const dto = {
        nome: 'User 1',
        email,
        rua: 'Rua Teste',
        numero: '100',
        bairro: 'Centro',
        complemento: '',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        status: 'ativo',
      };

      // Primeiro usuário
      await firstValueFrom(client.send({ cmd: 'create_user' }, dto));

      // Segundo usuário com mesmo email
      const response = await firstValueFrom(
        client.send({ cmd: 'create_user' }, dto),
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('Email já cadastrado');
    });

    it('deve retornar erro ao criar usuário com dados inválidos', async () => {
      const dto = {
        nome: '',
        email: 'invalid-email',
        rua: 'Rua Teste',
        numero: '100',
        bairro: 'Centro',
        complemento: '',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
      };

      const response = await firstValueFrom(
        client.send({ cmd: 'create_user' }, dto),
      );

      expect(response.success).toBe(false);
    });
  });

  describe('list_users', () => {
    it('deve listar usuários', async () => {
      const response = await firstValueFrom(
        client.send({ cmd: 'list_users' }, { includeDeleted: false }),
      );

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('get_user', () => {
    it('deve buscar usuário por ID', async () => {
      // Criar usuário
      const createDto = {
        nome: 'User To Find',
        email: `find${Date.now()}@example.com`,
        rua: 'Rua Teste',
        numero: '100',
        bairro: 'Centro',
        complemento: '',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        status: 'ativo',
      };

      const createResponse = await firstValueFrom(
        client.send({ cmd: 'create_user' }, createDto),
      );

      const userId = createResponse.data.id;

      // Buscar usuário
      const response = await firstValueFrom(
        client.send({ cmd: 'get_user' }, { id: userId }),
      );

      expect(response.success).toBe(true);
      expect(response.data.id).toBe(userId);
      expect(response.data.nome).toBe(createDto.nome);
    });

    it('deve retornar erro ao buscar usuário inexistente', async () => {
      const response = await firstValueFrom(
        client.send({ cmd: 'get_user' }, { id: 99999 }),
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('não encontrado');
    });
  });

  describe('update_user', () => {
    it('deve atualizar usuário com sucesso', async () => {
      // Criar usuário
      const createDto = {
        nome: 'User To Update',
        email: `update${Date.now()}@example.com`,
        rua: 'Rua Teste',
        numero: '100',
        bairro: 'Centro',
        complemento: '',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        status: 'ativo',
      };

      const createResponse = await firstValueFrom(
        client.send({ cmd: 'create_user' }, createDto),
      );

      const userId = createResponse.data.id;

      // Atualizar usuário
      const updateDto = {
        nome: 'Updated Name',
        status: 'inativo',
      };

      const response = await firstValueFrom(
        client.send({ cmd: 'update_user' }, { id: userId, dto: updateDto }),
      );

      expect(response.success).toBe(true);
      expect(response.data.nome).toBe(updateDto.nome);
      expect(response.data.status).toBe(updateDto.status);
    });
  });

  describe('delete_user', () => {
    it('deve deletar usuário com sucesso (soft delete)', async () => {
      // Criar usuário
      const createDto = {
        nome: 'User To Delete',
        email: `delete${Date.now()}@example.com`,
        rua: 'Rua Teste',
        numero: '100',
        bairro: 'Centro',
        complemento: '',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        status: 'ativo',
      };

      const createResponse = await firstValueFrom(
        client.send({ cmd: 'create_user' }, createDto),
      );

      const userId = createResponse.data.id;

      // Deletar usuário
      const deleteResponse = await firstValueFrom(
        client.send({ cmd: 'delete_user' }, { id: userId }),
      );

      expect(deleteResponse.success).toBe(true);

      // Verificar que não consegue mais buscar
      const getResponse = await firstValueFrom(
        client.send({ cmd: 'get_user' }, { id: userId }),
      );

      expect(getResponse.success).toBe(false);
    });
  });
});
