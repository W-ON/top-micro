import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FinanceService {
  constructor(
    @Inject('FINANCE_SERVICE') private readonly financeClient: ClientProxy,
  ) {}

  async create(createFinanceDto: CreateFinanceDto) {
    return firstValueFrom(
      this.financeClient.send({ cmd: 'create_finance' }, createFinanceDto),
    );
  }

  async findAll(userId?: number) {
    return firstValueFrom(
      this.financeClient.send({ cmd: 'find_all_finance' }, { userId }),
    );
  }

  async findByUser(userId: string) {
    return firstValueFrom(
      this.financeClient.send({ cmd: 'find_by_user' }, { userId }),
    );
  }

  async findOne(id: string) {
    return firstValueFrom(
      this.financeClient.send({ cmd: 'find_one_finance' }, { id }),
    );
  }

  async update(id: string, updateFinanceDto: UpdateFinanceDto) {
    return firstValueFrom(
      this.financeClient.send({ cmd: 'update_finance' }, { id, ...updateFinanceDto }),
    );
  }

  async remove(id: string) {
    return firstValueFrom(
      this.financeClient.send({ cmd: 'remove_finance' }, { id }),
    );
  }
}
