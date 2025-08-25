import { Module } from '@nestjs/common';
import { UsersinvestmentplanService } from './usersinvestmentplan.service';
import { UsersinvestmentplanController } from './usersinvestmentplan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Usersinvestmentplan,
  UsersinvestmentplanSchema,
} from './entities/usersinvestmentplan.entity';
import {
  Tradingaccount,
  TradingaccountSchema,
} from 'src/tradingaccount/entities/tradingaccount.entity';
import {
  Investmentplan,
  InvestmentplanSchema,
} from 'src/investmentplan/entities/investmentplan.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tradingaccount.name, schema: TradingaccountSchema },
      { name: Usersinvestmentplan.name, schema: UsersinvestmentplanSchema },
      { name: Investmentplan.name, schema: InvestmentplanSchema },
    ]),
  ],
  controllers: [UsersinvestmentplanController],
  providers: [UsersinvestmentplanService],
})
export class UsersinvestmentplanModule {}
