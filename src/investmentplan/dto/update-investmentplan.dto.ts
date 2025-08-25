import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestmentplanDto } from './create-investmentplan.dto';

export class UpdateInvestmentplanDto extends PartialType(CreateInvestmentplanDto) {}
