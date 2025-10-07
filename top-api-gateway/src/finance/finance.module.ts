import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FINANCE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.FINANCE_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.FINANCE_SERVICE_PORT) || 4002,
        },
      },
    ]),
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}
