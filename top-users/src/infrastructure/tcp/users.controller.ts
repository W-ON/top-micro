import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';

@Controller()
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() dto: CreateUserDto) {
    try {
      const user = await this.createUserUseCase.execute(dto);
      return {
        success: true,
        data: this.serializeUser(user),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @MessagePattern({ cmd: 'get_user' })
  async getUser(@Payload() data: { id: number }) {
    try {
      const user = await this.getUserUseCase.execute(data.id);
      return {
        success: true,
        data: this.serializeUser(user),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @MessagePattern({ cmd: 'list_users' })
  async listUsers(
    @Payload()
    data: {
      includeDeleted?: boolean;
      page?: number;
      limit?: number;
      search?: string;
    },
  ) {
    try {
      const allUsers = await this.listUsersUseCase.execute(data.includeDeleted);

      // Filtrar por busca se fornecido
      let filteredUsers = allUsers;
      if (data.search) {
        const searchLower = data.search.toLowerCase();
        filteredUsers = allUsers.filter(
          (user) =>
            user.nome?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.cpf?.toLowerCase().includes(searchLower),
        );
      }

      // Paginação
      const page = data.page || 1;
      const limit = data.limit || 10;
      const total = filteredUsers.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedUsers.map((user) => this.serializeUser(user)),
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(@Payload() data: { id: number; dto: UpdateUserDto }) {
    try {
      const user = await this.updateUserUseCase.execute(data.id, data.dto);
      return {
        success: true,
        data: this.serializeUser(user),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(@Payload() data: { id: number }) {
    try {
      await this.deleteUserUseCase.execute(data.id);
      return {
        success: true,
        data: { message: 'Usuário deletado com sucesso' },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private serializeUser(user: any) {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      rua: user.address.rua,
      numero: user.address.numero,
      bairro: user.address.bairro,
      complemento: user.address.complemento,
      cidade: user.address.cidade,
      estado: user.address.estado,
      cep: user.address.cep,
      status: user.status,
      isDeleted: user.isDeleted,
      created: user.created,
      updated: user.updated,
      deleted: user.deleted,
    };
  }
}
