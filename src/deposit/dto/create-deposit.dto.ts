import {
  IsMongoId,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateDepositDto {
  @IsOptional()
  adminWalletId: string;

  @IsNumber()
  amount: number;

  @IsBoolean()
  havePaid: boolean;

  @IsNotEmpty()
  clientId: string;
}

export class ApproveDepositDto {
  @IsBoolean()
  approvePayment: boolean;
}
