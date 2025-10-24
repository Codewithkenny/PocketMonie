import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContributionsService } from './contribution.service';
import { ContributionController } from './contribution.controller';
import { Contribution } from './contribution.entity';
import { GroupSaving } from '../groupsaving/groupsaving.entity';
import { TargetSaving } from '../target-savings/target-savings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contribution, GroupSaving, TargetSaving]),
  ],
  providers: [ContributionsService],
  controllers: [ContributionController],
  exports: [ContributionsService],
})
export class ContributionModule {}
