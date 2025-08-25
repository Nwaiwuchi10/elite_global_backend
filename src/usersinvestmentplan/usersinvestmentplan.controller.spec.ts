import { Test, TestingModule } from '@nestjs/testing';
import { UsersinvestmentplanController } from './usersinvestmentplan.controller';
import { UsersinvestmentplanService } from './usersinvestmentplan.service';

describe('UsersinvestmentplanController', () => {
  let controller: UsersinvestmentplanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersinvestmentplanController],
      providers: [UsersinvestmentplanService],
    }).compile();

    controller = module.get<UsersinvestmentplanController>(UsersinvestmentplanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
