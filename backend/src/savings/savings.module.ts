import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlexWallet } from '../flex-wallet/flex-wallet.entity';
import { TargetSaving } from '../target-savings/target-savings.entity';
import { GroupSaving } from '../groupsaving/groupsaving.entity';
import { FixedDeposit } from '../fixed-deposit/fixed-deposit.entity';
import { Reward } from '../rewards/reward.entity';
import { SafeLock } from '../safelock/safelock.entity';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FlexWallet,
      TargetSaving,
      GroupSaving,
      FixedDeposit,
      Reward,
      SafeLock,
    ]),
  ],
  providers: [SavingsService],
  controllers: [SavingsController],
})
export class SavingsModule {}
