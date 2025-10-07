import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateFinanceDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  type: string; // 'income' or 'expense'
}
