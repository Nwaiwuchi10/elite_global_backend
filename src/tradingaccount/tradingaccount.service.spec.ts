import { Test, TestingModule } from '@nestjs/testing';
import { TradingaccountService } from './tradingaccount.service';

describe('TradingaccountService', () => {
  let service: TradingaccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradingaccountService],
    }).compile();

    service = module.get<TradingaccountService>(TradingaccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
