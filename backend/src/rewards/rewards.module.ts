import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from './reward.entity';
import { RewardService } from './rewards.service';
import { RewardController } from './rewards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reward])],
  providers: [RewardService],
  controllers: [RewardController],
})
export class RewardsModule {}
