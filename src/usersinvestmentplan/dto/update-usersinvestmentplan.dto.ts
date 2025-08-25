import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersinvestmentplanDto } from './create-usersinvestmentplan.dto';

export class UpdateUsersinvestmentplanDto extends PartialType(CreateUsersinvestmentplanDto) {}
