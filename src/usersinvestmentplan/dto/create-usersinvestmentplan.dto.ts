import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateUsersinvestmentplanDto {
  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  investmentplanId: string;

  @IsNotEmpty()
  amount: string;
}
