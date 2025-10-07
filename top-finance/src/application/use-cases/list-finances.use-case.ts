import { Inject, Injectable } from '@nestjs/common';
import { Finance } from '../../domain/entities/finance.entity';
import {
  IFinanceRepository,
  FINANCE_REPOSITORY,
} from '../../domain/repositories/finance.repository.interface';

@Injectable()
export class ListFinancesUseCase {
  constructor(
    @Inject(FINANCE_REPOSITORY)
    private readonly financeRepository: IFinanceRepository,
  ) {}

  async execute(includeDeleted: boolean = false): Promise<Finance[]> {
    return await this.financeRepository.findAll(includeDeleted);
  }
}
