import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateFinanceUseCase } from '../../application/use-cases/create-finance.use-case';
import { GetFinanceUseCase } from '../../application/use-cases/get-finance.use-case';
import { ListFinancesUseCase } from '../../application/use-cases/list-finances.use-case';
import { ListFinancesByUserUseCase } from '../../application/use-cases/list-finances-by-user.use-case';
import { UpdateFinanceUseCase } from '../../application/use-cases/update-finance.use-case';
import { DeleteFinanceUseCase } from '../../application/use-cases/delete-finance.use-case';
import { CreateFinanceDto } from '../../application/dtos/create-finance.dto';
import { UpdateFinanceDto } from '../../application/dtos/update-finance.dto';

@Controller()
export class FinanceController {
  constructor(
    private readonly createFinanceUseCase: CreateFinanceUseCase,
    private readonly getFinanceUseCase: GetFinanceUseCase,
    private readonly listFinancesUseCase: ListFinancesUseCase,
    private readonly listFinancesByUserUseCase: ListFinancesByUserUseCase,
    private readonly updateFinanceUseCase: UpdateFinanceUseCase,
    private readonly deleteFinanceUseCase: DeleteFinanceUseCase,
  ) {}

  @MessagePattern({ cmd: 'create_finance' })
  async createFinance(@Payload() dto: CreateFinanceDto) {
    try {
      const finance = await this.createFinanceUseCase.execute(dto);
      return {
        success: true,
        data: this.serializeFinance(finance),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @MessagePattern({ cmd: 'get_finance' })
  async getFinance(@Payload() data: { id: number }) {
    try {
      const finance = await this.getFinanceUseCase.execute(data.id);
      return {
        success: true,
        data: this.serializeFinance(finance),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @MessagePattern({ cmd: 'list_finances' })
  async listFinances(@Payload() data: { includeDeleted?: boolean }) {
    try {
      const finances = await this.listFinancesUseCase.execute(data.includeDeleted);
      return {
        success: true,
        data: finances.map((finance) => this.serializeFinance(finance)),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @MessagePattern({ cmd: 'list_finances_by_user' })
  async listFinancesByUser(@Payload() data: { userId: number; includeDeleted?: boolean }) {
    try {
      const finances = await this.listFinancesByUserUseCase.execute(
        data.userId,
        data.includeDeleted,
      );
      return {
        success: true,
        data: finances.map((finance) => this.serializeFinance(finance)),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @MessagePattern({ cmd: 'update_finance' })
  async updateFinance(@Payload() data: { id: number; dto: UpdateFinanceDto }) {
    try {
      const finance = await this.updateFinanceUseCase.execute(data.id, data.dto);
      return {
        success: true,
        data: this.serializeFinance(finance),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @MessagePattern({ cmd: 'delete_finance' })
  async deleteFinance(@Payload() data: { id: number }) {
    try {
      await this.deleteFinanceUseCase.execute(data.id);
      return {
        success: true,
        data: { message: 'Finança deletada com sucesso' },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private serializeFinance(finance: any) {
    return {
      id: finance.id,
      user_id: finance.userId,
      valor: finance.valor,
      descricao: finance.descricao,
      isDeleted: finance.isDeleted,
      created: finance.created,
      updated: finance.updated,
      deleted: finance.deleted,
    };
  }
}
