import { Module } from '@nestjs/common';
import { InvestmentplanService } from './investmentplan.service';
import { InvestmentplanController } from './investmentplan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Investmentplan,
  InvestmentplanSchema,
} from './entities/investmentplan.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investmentplan.name, schema: InvestmentplanSchema },
    ]),
  ],
  controllers: [InvestmentplanController],
  providers: [InvestmentplanService],
})
export class InvestmentplanModule {}
