import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';

export class CreateFinanceDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  valor: number;

  @IsString()
  @IsNotEmpty()
  descricao: string;
}
