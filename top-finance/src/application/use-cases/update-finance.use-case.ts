import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Finance } from '../../domain/entities/finance.entity';
import {
  IFinanceRepository,
  FINANCE_REPOSITORY,
} from '../../domain/repositories/finance.repository.interface';
import { UpdateFinanceDto } from '../dtos/update-finance.dto';

@Injectable()
export class UpdateFinanceUseCase {
  constructor(
    @Inject(FINANCE_REPOSITORY)
    private readonly financeRepository: IFinanceRepository,
  ) {}

  async execute(id: number, dto: UpdateFinanceDto): Promise<Finance> {
    const finance = await this.financeRepository.findById(id);

    if (!finance || finance.isDeleted) {
      throw new NotFoundException(`Finança com ID ${id} não encontrada`);
    }

    // Atualizar apenas os campos fornecidos
    finance.updateInfo(
      dto.valor ?? finance.valor,
      dto.descricao ?? finance.descricao,
    );

    return await this.financeRepository.update(id, finance);
  }
}
