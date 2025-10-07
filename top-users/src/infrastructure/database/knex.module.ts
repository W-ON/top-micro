import { Module, Global } from '@nestjs/common';
import { Knex, knex } from 'knex';
import knexConfig from './knexfile';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: KNEX_CONNECTION,
      useFactory: (): Knex => {
        return knex(knexConfig);
      },
    },
  ],
  exports: [KNEX_CONNECTION],
})
export class KnexModule {}
