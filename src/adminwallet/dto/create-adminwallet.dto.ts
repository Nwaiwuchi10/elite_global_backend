import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAdminwalletDto {
  @IsNotEmpty()
  walletName: string;

  @IsNotEmpty()
  walletAdress: string;

  @IsOptional()
  walletQR: string;
}
