import { Inject, Injectable } from '@nestjs/common';
import { Finance } from '../../domain/entities/finance.entity';
import {
  IFinanceRepository,
  FINANCE_REPOSITORY,
} from '../../domain/repositories/finance.repository.interface';
import { CreateFinanceDto } from '../dtos/create-finance.dto';

@Injectable()
export class CreateFinanceUseCase {
  constructor(
    @Inject(FINANCE_REPOSITORY)
    private readonly financeRepository: IFinanceRepository,
  ) {}

  async execute(dto: CreateFinanceDto): Promise<Finance> {
    const finance = Finance.create(dto.user_id, dto.valor, dto.descricao);

    return await this.financeRepository.create(finance);
  }
}
