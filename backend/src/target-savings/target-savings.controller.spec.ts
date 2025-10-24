import { Test, TestingModule } from '@nestjs/testing';
import { TargetSavingsController } from './target-savings.controller';

describe('TargetController', () => {
  let controller: TargetSavingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TargetSavingsController],
    }).compile();

    controller = module.get<TargetSavingsController>(TargetSavingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
