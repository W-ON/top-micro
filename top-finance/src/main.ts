import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { FinanceModule } from './finance.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FinanceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.TCP_HOST || '0.0.0.0',
        port: parseInt(process.env.TCP_PORT || '4002'),
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
  console.log(`🚀 Microserviço top-finance rodando na porta ${process.env.TCP_PORT || 4002}`);
}

bootstrap();
