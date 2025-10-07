import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { User, UserStatus } from '../../domain/entities/user.entity';
import { Address } from '../../domain/value-objects/address.value-object';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { KNEX_CONNECTION } from '../database/knex.module';

interface UserRow {
  id: number;
  nome: string;
  email: string;
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  estado: string;
  cep: string;
  status: 'ativo' | 'inativo';
  is_deleted: boolean;
  created: Date;
  updated: Date;
  deleted?: Date;
}

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly tableName = 'users';

  constructor(
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
  ) {}

  private mapRowToEntity(row: UserRow): User {
    const address = new Address(
      row.rua,
      row.numero,
      row.bairro,
      row.complemento,
      row.cidade,
      row.estado,
      row.cep,
    );

    return new User(
      row.id,
      row.nome,
      row.email,
      address,
      row.status === 'ativo' ? UserStatus.ATIVO : UserStatus.INATIVO,
      row.is_deleted,
      new Date(row.created),
      new Date(row.updated),
      row.deleted ? new Date(row.deleted) : undefined,
    );
  }

  private mapEntityToRow(user: User): Partial<UserRow> {
    return {
      nome: user.nome,
      email: user.email,
      rua: user.address.rua,
      numero: user.address.numero,
      bairro: user.address.bairro,
      complemento: user.address.complemento,
      cidade: user.address.cidade,
      estado: user.address.estado,
      cep: user.address.cep,
      status: user.status,
      is_deleted: user.isDeleted,
      updated: new Date(),
    };
  }

  async create(user: User): Promise<User> {
    const row = this.mapEntityToRow(user);
    const [id] = await this.knex(this.tableName).insert(row).returning('id');

    const createdUser = await this.findById(typeof id === 'object' ? id.id : id);
    return createdUser;
  }

  async findById(id: number): Promise<User | null> {
    const row = await this.knex(this.tableName).where({ id }).first();

    if (!row) return null;

    return this.mapRowToEntity(row);
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.knex(this.tableName).where({ email }).first();

    if (!row) return null;

    return this.mapRowToEntity(row);
  }

  async findAll(includeDeleted: boolean = false): Promise<User[]> {
    let query = this.knex(this.tableName);

    if (!includeDeleted) {
      query = query.where({ is_deleted: false });
    }

    const rows = await query.select('*');

    return rows.map((row) => this.mapRowToEntity(row));
  }

  async update(id: number, user: User): Promise<User> {
    const row = this.mapEntityToRow(user);
    await this.knex(this.tableName).where({ id }).update(row);

    const updatedUser = await this.findById(id);
    return updatedUser;
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
