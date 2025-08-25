import { PartialType } from '@nestjs/mapped-types';
import { CreateTradingaccountDto } from './create-tradingaccount.dto';

export class UpdateTradingaccountDto extends PartialType(CreateTradingaccountDto) {}
