import { Test, TestingModule } from '@nestjs/testing';
import { FixedDepositController } from './fixed-deposit.controller';

describe('FixedDepositController', () => {
  let controller: FixedDepositController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FixedDepositController],
    }).compile();

    controller = module.get<FixedDepositController>(FixedDepositController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
