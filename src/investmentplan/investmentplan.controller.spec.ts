import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentplanController } from './investmentplan.controller';
import { InvestmentplanService } from './investmentplan.service';

describe('InvestmentplanController', () => {
  let controller: InvestmentplanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestmentplanController],
      providers: [InvestmentplanService],
    }).compile();

    controller = module.get<InvestmentplanController>(InvestmentplanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
