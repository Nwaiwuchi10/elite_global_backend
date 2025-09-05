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
import { MailService } from 'src/users/services/mai.service';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { Deposit, DepositSchema } from 'src/deposit/entities/deposit.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tradingaccount.name, schema: TradingaccountSchema },
      { name: Usersinvestmentplan.name, schema: UsersinvestmentplanSchema },
      { name: User.name, schema: UserSchema },
      { name: Deposit.name, schema: DepositSchema },
    ]),
  ],
  controllers: [TradingaccountController],
  providers: [TradingaccountService, MailService],
})
export class TradingaccountModule {}
