import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserActivity } from './user-activity.entity';
import { User } from '../users/user.entity';
import { TargetSaving } from '../target-savings/target-savings.entity';

@Injectable()
export class UserActivityService {
  constructor(
    @InjectRepository(UserActivity)
    private activityRepo: Repository<UserActivity>,

    @InjectRepository(TargetSaving)
    private targetRepo: Repository<TargetSaving>,
  ) {}

  async logActivity(
    user: User,
    type: string,
    action: string,
    description: string,
    amount: number = 0,
  ) {
    const activity = this.activityRepo.create({
      user,
      type,
      action,
      description,
      amount,
    });
    return this.activityRepo.save(activity);
  }

  async getUserActivities(user: User) {
    return this.activityRepo.find({
      where: { user },
      order: { timestamp: 'DESC' },
    });
  }

  async getTotalSavings(user: User) {
    const targetSum = await this.targetRepo
      .createQueryBuilder('target')
      .select('SUM(target.currentAmount)', 'total')
      .where('target.userId = :userId', { userId: user.id })
      .getRawOne();

    const targetTotal = Number(targetSum.total) || 0;

    return {
      targetTotal,
      flexWalletTotal: 0,
      fixedDepositTotal: 0,
      rewardsTotal: 0,
      secureLockTotal: 0,
      groupSavingsTotal: 0,
    };
  }
}
