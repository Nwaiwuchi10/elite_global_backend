import { Test, TestingModule } from '@nestjs/testing';
import { AdminwalletService } from './adminwallet.service';

describe('AdminwalletService', () => {
  let service: AdminwalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminwalletService],
    }).compile();

    service = module.get<AdminwalletService>(AdminwalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
