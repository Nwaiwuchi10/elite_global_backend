import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentplanService } from './investmentplan.service';

describe('InvestmentplanService', () => {
  let service: InvestmentplanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestmentplanService],
    }).compile();

    service = module.get<InvestmentplanService>(InvestmentplanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
