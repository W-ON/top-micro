import { Address } from '../value-objects/address.value-object';

export enum UserStatus {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
}

export class User {
  constructor(
    public id: number,
    public nome: string,
    public email: string,
    public address: Address,
    public status: UserStatus,
    public isDeleted: boolean = false,
    public created: Date = new Date(),
    public updated: Date = new Date(),
    public deleted?: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.nome || this.nome.trim().length === 0) {
      throw new Error('Nome é obrigatório');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Email inválido');
    }

    if (!this.address) {
      throw new Error('Endereço é obrigatório');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  activate(): void {
    this.status = UserStatus.ATIVO;
    this.updated = new Date();
  }

  deactivate(): void {
    this.status = UserStatus.INATIVO;
    this.updated = new Date();
  }

  softDelete(): void {
    this.isDeleted = true;
    this.deleted = new Date();
    this.updated = new Date();
  }

  updateInfo(
    nome: string,
    email: string,
    address: Address,
    status: UserStatus,
  ): void {
    this.nome = nome;
    this.email = email;
    this.address = address;
    this.status = status;
    this.updated = new Date();
    this.validate();
  }

  static create(
    nome: string,
    email: string,
    address: Address,
    status: UserStatus = UserStatus.ATIVO,
  ): User {
    return new User(null, nome, email, address, status);
  }
}
