import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  country: string;

  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  //   @MinLength(6)
  //   @Matches(/^(?=.*[0-9])/, {
  //     message: 'Password must contain at least one number',
  //   })
  password: string;

  @IsOptional()
  @IsString()
  referralCode?: string;
}
