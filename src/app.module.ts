import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { InvestmentplanModule } from './investmentplan/investmentplan.module';
import { UsersinvestmentplanModule } from './usersinvestmentplan/usersinvestmentplan.module';
import { DepositModule } from './deposit/deposit.module';
import { TradingaccountModule } from './tradingaccount/tradingaccount.module';

import { AdminModule } from './admin/admin.module';
import { AdminwalletModule } from './adminwallet/adminwallet.module';

import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    UsersModule,
    InvestmentplanModule,
    UsersinvestmentplanModule,
    DepositModule,
    TradingaccountModule,

    AdminModule,
    AdminwalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
