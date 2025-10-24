import { Test, TestingModule } from '@nestjs/testing';
import { TargetSavingsService } from './target-savings.service';

describe('TargetService', () => {
  let service: TargetSavingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TargetSavingsService],
    }).compile();

    service = module.get<TargetSavingsService>(TargetSavingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
