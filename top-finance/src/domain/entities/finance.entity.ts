export class Finance {
  constructor(
    public id: number,
    public userId: number,
    public valor: number,
    public descricao: string,
    public isDeleted: boolean = false,
    public created: Date = new Date(),
    public updated: Date = new Date(),
    public deleted?: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.userId || this.userId <= 0) {
      throw new Error('User ID é obrigatório e deve ser maior que zero');
    }

    if (this.valor === undefined || this.valor === null) {
      throw new Error('Valor é obrigatório');
    }

    if (typeof this.valor !== 'number') {
      throw new Error('Valor deve ser um número');
    }

    if (!this.descricao || this.descricao.trim().length === 0) {
      throw new Error('Descrição é obrigatória');
    }

    if (this.descricao.length > 500) {
      throw new Error('Descrição deve ter no máximo 500 caracteres');
    }
  }

  softDelete(): void {
    this.isDeleted = true;
    this.deleted = new Date();
    this.updated = new Date();
  }

  updateInfo(valor: number, descricao: string): void {
    this.valor = valor;
    this.descricao = descricao;
    this.updated = new Date();
    this.validate();
  }

  static create(userId: number, valor: number, descricao: string): Finance {
    return new Finance(null, userId, valor, descricao);
  }
}
