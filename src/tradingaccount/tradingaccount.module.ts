import { Module } from '@nestjs/common';
import { TradingaccountService } from './tradingaccount.service';
import { TradingaccountController } from './tradingaccount.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Tradingaccount,
  TradingaccountSchema,
} from './entities/tradingaccount.entity';
import {
  Usersinvestmentplan,
  UsersinvestmentplanSchema,
} from 'src/usersinvestmentplan/entities/usersinvestmentplan.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tradingaccount.name, schema: TradingaccountSchema },
      { name: Usersinvestmentplan.name, schema: UsersinvestmentplanSchema },
    ]),
  ],
  controllers: [TradingaccountController],
  providers: [TradingaccountService],
})
export class TradingaccountModule {}
