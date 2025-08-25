import { Test, TestingModule } from '@nestjs/testing';
import { AdminwalletController } from './adminwallet.controller';
import { AdminwalletService } from './adminwallet.service';

describe('AdminwalletController', () => {
  let controller: AdminwalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminwalletController],
      providers: [AdminwalletService],
    }).compile();

    controller = module.get<AdminwalletController>(AdminwalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
