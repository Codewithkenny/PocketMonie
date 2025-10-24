import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlexWallet } from '../flex-wallet/flex-wallet.entity';
import { TargetSaving } from '../target-savings/target-savings.entity';
import { GroupSaving } from '../groupsaving/groupsaving.entity';
import { FixedDeposit } from '../fixed-deposit/fixed-deposit.entity';
import { Reward } from '../rewards/reward.entity';
import { SafeLock } from '../safelock/safelock.entity';

@Injectable()
export class SavingsService {
  constructor(
    @InjectRepository(FlexWallet)
    private readonly flexWalletRepo: Repository<FlexWallet>,
    @InjectRepository(TargetSaving)
    private readonly targetSavingRepo: Repository<TargetSaving>,
    @InjectRepository(GroupSaving)
    private readonly groupSavingRepo: Repository<GroupSaving>,
    @InjectRepository(FixedDeposit)
    private readonly fixedDepositRepo: Repository<FixedDeposit>,
    @InjectRepository(Reward) private readonly rewardsRepo: Repository<Reward>,
    @InjectRepository(SafeLock)
    private readonly secureLockRepo: Repository<SafeLock>,
  ) {}

  async getTotalSavings(userId: string): Promise<number> {
    const flexSum = await this.flexWalletRepo
      .createQueryBuilder('wallet')
      .select('SUM(wallet.balance)', 'sum')
      .where('wallet.userId = :userId', { userId })
      .getRawOne();

    const targetSum = await this.targetSavingRepo
      .createQueryBuilder('target')
      .select('SUM(target.currentAmount)', 'sum')
      .where('target.userId = :userId', { userId })
      .getRawOne();

    const groupSum = await this.groupSavingRepo
      .createQueryBuilder('grp')
      .select('SUM(grp.currentAmount)', 'sum')
      .where('grp.userId = :userId', { userId })
      .getRawOne();

    const fixedSum = await this.fixedDepositRepo
      .createQueryBuilder('fixed')
      .select('SUM(fixed.balance)', 'sum')
      .where('fixed.userId = :userId', { userId })
      .getRawOne();

    const rewardSum = await this.rewardsRepo
      .createQueryBuilder('reward')
      .select('SUM(reward.amount)', 'sum')
      .where('reward.userId = :userId', { userId })
      .getRawOne();

    const lockSum = await this.secureLockRepo
      .createQueryBuilder('lock')
      .select('SUM(lock.balance)', 'sum')
      .where('lock.userId = :userId', { userId })
      .getRawOne();

    const total =
      Number(flexSum.sum || 0) +
      Number(targetSum.sum || 0) +
      Number(groupSum.sum || 0) +
      Number(fixedSum.sum || 0) +
      Number(rewardSum.sum || 0) +
      Number(lockSum.sum || 0);

    return total;
  }
}
