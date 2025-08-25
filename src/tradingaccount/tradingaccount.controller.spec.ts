import { Test, TestingModule } from '@nestjs/testing';
import { TradingaccountController } from './tradingaccount.controller';
import { TradingaccountService } from './tradingaccount.service';

describe('TradingaccountController', () => {
  let controller: TradingaccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradingaccountController],
      providers: [TradingaccountService],
    }).compile();

    controller = module.get<TradingaccountController>(TradingaccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
