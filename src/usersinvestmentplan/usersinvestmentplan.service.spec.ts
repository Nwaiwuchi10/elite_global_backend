import { Test, TestingModule } from '@nestjs/testing';
import { UsersinvestmentplanService } from './usersinvestmentplan.service';

describe('UsersinvestmentplanService', () => {
  let service: UsersinvestmentplanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersinvestmentplanService],
    }).compile();

    service = module.get<UsersinvestmentplanService>(UsersinvestmentplanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
