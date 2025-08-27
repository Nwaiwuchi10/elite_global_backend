import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Deposit, DepositSchema } from './entities/deposit.entity';
import {
  Tradingaccount,
  TradingaccountSchema,
} from 'src/tradingaccount/entities/tradingaccount.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { MailService } from 'src/users/services/mai.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Deposit.name, schema: DepositSchema },
      { name: User.name, schema: UserSchema },
      { name: Tradingaccount.name, schema: TradingaccountSchema },
    ]),
  ],
  controllers: [DepositController],
  providers: [DepositService, MailService],
})
export class DepositModule {}
