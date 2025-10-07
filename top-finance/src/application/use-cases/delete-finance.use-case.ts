import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IFinanceRepository,
  FINANCE_REPOSITORY,
} from '../../domain/repositories/finance.repository.interface';

@Injectable()
export class DeleteFinanceUseCase {
  constructor(
    @Inject(FINANCE_REPOSITORY)
    private readonly financeRepository: IFinanceRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const finance = await this.financeRepository.findById(id);

    if (!finance || finance.isDeleted) {
      throw new NotFoundException(`Finança com ID ${id} não encontrada`);
    }

    await this.financeRepository.softDelete(id);
  }
}
