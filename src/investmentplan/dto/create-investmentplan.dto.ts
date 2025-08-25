import { IsString, IsNumber, Min } from 'class-validator';

export class CreateInvestmentplanDto {
  @IsString()
  planName: string;

  @IsNumber()
  @Min(0)
  minAmount: number;

  @IsNumber()
  @Min(0)
  maxAmount: number;

  @IsNumber()
  @Min(1)
  duration: number; // e.g. days

  @IsNumber()
  @Min(0)
  interestRate: number;
}
