import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Finance } from '../../domain/entities/finance.entity';
import {
  IFinanceRepository,
  FINANCE_REPOSITORY,
} from '../../domain/repositories/finance.repository.interface';

@Injectable()
export class GetFinanceUseCase {
  constructor(
    @Inject(FINANCE_REPOSITORY)
    private readonly financeRepository: IFinanceRepository,
  ) {}

  async execute(id: number): Promise<Finance> {
    const finance = await this.financeRepository.findById(id);

    if (!finance || finance.isDeleted) {
      throw new NotFoundException(`Finança com ID ${id} não encontrada`);
    }

    return finance;
  }
}
