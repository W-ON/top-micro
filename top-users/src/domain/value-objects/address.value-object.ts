export class Address {
  constructor(
    public readonly rua: string,
    public readonly numero: string,
    public readonly bairro: string,
    public readonly complemento: string,
    public readonly cidade: string,
    public readonly estado: string,
    public readonly cep: string,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.rua) throw new Error('Rua é obrigatória');
    if (!this.numero) throw new Error('Número é obrigatório');
    if (!this.bairro) throw new Error('Bairro é obrigatório');
    if (!this.cidade) throw new Error('Cidade é obrigatória');
    if (!this.estado) throw new Error('Estado é obrigatório');
    if (!this.cep) throw new Error('CEP é obrigatório');

    const cepRegex = /^\d{5}-?\d{3}$/;
    if (!cepRegex.test(this.cep)) {
      throw new Error('CEP inválido');
    }
  }

  toString(): string {
    return `${this.rua}, ${this.numero} - ${this.bairro}, ${this.cidade}/${this.estado} - ${this.cep}`;
  }
}
