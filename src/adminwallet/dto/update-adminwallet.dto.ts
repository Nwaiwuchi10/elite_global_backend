import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminwalletDto } from './create-adminwallet.dto';

export class UpdateAdminwalletDto extends PartialType(CreateAdminwalletDto) {}
