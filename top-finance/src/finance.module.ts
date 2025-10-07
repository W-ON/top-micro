import { Module } from '@nestjs/common';
import { KnexModule } from './infrastructure/database/knex.module';
import { FinanceController } from './infrastructure/tcp/finance.controller';
import { FinanceRepository } from './infrastructure/repositories/finance.repository';
import { FINANCE_REPOSITORY } from './domain/repositories/finance.repository.interface';

// Use Cases
import { CreateFinanceUseCase } from './application/use-cases/create-finance.use-case';
import { GetFinanceUseCase } from './application/use-cases/get-finance.use-case';
import { ListFinancesUseCase } from './application/use-cases/list-finances.use-case';
import { ListFinancesByUserUseCase } from './application/use-cases/list-finances-by-user.use-case';
import { UpdateFinanceUseCase } from './application/use-cases/update-finance.use-case';
import { DeleteFinanceUseCase } from './application/use-cases/delete-finance.use-case';

@Module({
  imports: [KnexModule],
  controllers: [FinanceController],
  providers: [
    {
      provide: FINANCE_REPOSITORY,
      useClass: FinanceRepository,
    },
    CreateFinanceUseCase,
    GetFinanceUseCase,
    ListFinancesUseCase,
    ListFinancesByUserUseCase,
    UpdateFinanceUseCase,
    DeleteFinanceUseCase,
  ],
})
export class FinanceModule {}
