import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { Finance } from '../../domain/entities/finance.entity';
import { IFinanceRepository } from '../../domain/repositories/finance.repository.interface';
import { KNEX_CONNECTION } from '../database/knex.module';

interface FinanceRow {
  id: number;
  user_id: number;
  valor: string;
  descricao: string;
  is_deleted: boolean;
  created: Date;
  updated: Date;
  deleted?: Date;
}

@Injectable()
export class FinanceRepository implements IFinanceRepository {
  private readonly tableName = 'finances';

  constructor(
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
  ) {}

  private mapRowToEntity(row: FinanceRow): Finance {
    return new Finance(
      row.id,
      row.user_id,
      parseFloat(row.valor),
      row.descricao,
      row.is_deleted,
      new Date(row.created),
      new Date(row.updated),
      row.deleted ? new Date(row.deleted) : undefined,
    );
  }

  private mapEntityToRow(finance: Finance): Partial<FinanceRow> {
    return {
      user_id: finance.userId,
      valor: finance.valor.toString(),
      descricao: finance.descricao,
      is_deleted: finance.isDeleted,
      updated: new Date(),
    };
  }

  async create(finance: Finance): Promise<Finance> {
    const row = this.mapEntityToRow(finance);
    const [id] = await this.knex(this.tableName).insert(row).returning('id');

    const createdFinance = await this.findById(typeof id === 'object' ? id.id : id);
    return createdFinance;
  }

  async findById(id: number): Promise<Finance | null> {
    const row = await this.knex(this.tableName).where({ id }).first();

    if (!row) return null;

    return this.mapRowToEntity(row);
  }

  async findByUserId(userId: number, includeDeleted: boolean = false): Promise<Finance[]> {
    let query = this.knex(this.tableName).where({ user_id: userId });

    if (!includeDeleted) {
      query = query.where({ is_deleted: false });
    }

    const rows = await query.select('*');

    return rows.map((row) => this.mapRowToEntity(row));
  }

  async findAll(includeDeleted: boolean = false): Promise<Finance[]> {
    let query = this.knex(this.tableName);

    if (!includeDeleted) {
      query = query.where({ is_deleted: false });
    }

    const rows = await query.select('*');

    return rows.map((row) => this.mapRowToEntity(row));
  }

  async update(id: number, finance: Finance): Promise<Finance> {
    const row = this.mapEntityToRow(finance);
    await this.knex(this.tableName).where({ id }).update(row);

    const updatedFinance = await this.findById(id);
    return updatedFinance;
  }

  async softDelete(id: number): Promise<void> {
    await this.knex(this.tableName).where({ id }).update({
      is_deleted: true,
      deleted: new Date(),
      updated: new Date(),
    });
  }

  async hardDelete(id: number): Promise<void> {
    await this.knex(this.tableName).where({ id }).del();
  }
}
