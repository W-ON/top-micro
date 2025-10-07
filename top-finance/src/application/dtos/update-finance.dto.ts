import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateFinanceDto {
  @IsNumber()
  @IsOptional()
  valor?: number;

  @IsString()
  @IsOptional()
  descricao?: string;
}
