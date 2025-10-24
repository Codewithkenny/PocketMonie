import { Test, TestingModule } from '@nestjs/testing';
import { FlexWalletController } from './flex-wallet.controller';

describe('FlexWalletController', () => {
  let controller: FlexWalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlexWalletController],
    }).compile();

    controller = module.get<FlexWalletController>(FlexWalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
