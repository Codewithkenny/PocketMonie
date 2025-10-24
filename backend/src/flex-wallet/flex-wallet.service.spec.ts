import { Test, TestingModule } from '@nestjs/testing';
import { FlexWalletService } from './flex-wallet.service';

describe('FlexWalletService', () => {
  let service: FlexWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlexWalletService],
    }).compile();

    service = module.get<FlexWalletService>(FlexWalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
