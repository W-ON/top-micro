import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(includeDeleted?: boolean): Promise<User[]>;
  update(id: number, user: User): Promise<User>;
  softDelete(id: number): Promise<void>;
  hardDelete(id: number): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
