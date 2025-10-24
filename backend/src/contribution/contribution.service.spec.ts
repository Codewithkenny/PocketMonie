import { Test, TestingModule } from '@nestjs/testing';
import { ContributionsService } from './contribution.service';


describe('ContributionService', () => {
  let service: ContributionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContributionsService],
    }).compile();

    service = module.get<ContributionsService>(ContributionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
