import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateFinanceDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0.01)
  amount?: number;

  @IsString()
  @IsOptional()
  type?: string; // 'income' or 'expense'
}
