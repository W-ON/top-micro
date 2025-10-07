import { Finance } from '../entities/finance.entity';

export interface IFinanceRepository {
  create(finance: Finance): Promise<Finance>;
  findById(id: number): Promise<Finance | null>;
  findByUserId(userId: number, includeDeleted?: boolean): Promise<Finance[]>;
  findAll(includeDeleted?: boolean): Promise<Finance[]>;
  update(id: number, finance: Finance): Promise<Finance>;
  softDelete(id: number): Promise<void>;
  hardDelete(id: number): Promise<void>;
}

export const FINANCE_REPOSITORY = Symbol('FINANCE_REPOSITORY');
