import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SafeLock } from './safelock.entity';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';

@Injectable()
export class SafeLockService {
  constructor(
    @InjectRepository(SafeLock)
    private readonly safeLockRepo: Repository<SafeLock>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
  ) {}

  // Create a SafeLock
  async createSafeLock(
    userId: string,
    amount: number,
    durationInDays: number,
  ): Promise<SafeLock> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.balance < amount)
      throw new BadRequestException('Insufficient balance');

    user.balance -= amount;
    await this.userRepo.save(user);

    const interestRate = 1.5;
    const interest = (amount * interestRate) / 100;
    const now = new Date();
    const maturity = new Date(now);
    maturity.setDate(now.getDate() + durationInDays);

    const safeLock = this.safeLockRepo.create({
      user,
      amount,
      startDate: now,
      maturityDate: maturity,
      status: 'active',
      interestEarned: interest,
      interestRate,
    });
    const savedLock = await this.safeLockRepo.save(safeLock);

    const tx = this.txRepo.create({
      user,
      safeLock: savedLock,
      type: 'lock',
      amount,
      description: `SafeLock created with ${interestRate}% interest.`,
    });
    await this.txRepo.save(tx);

    return savedLock;
  }

  // Release a SafeLock
  async releaseSafeLock(lockId: string): Promise<SafeLock> {
    const lock = await this.safeLockRepo.findOne({
      where: { id: lockId },
      relations: ['user'],
    });
    if (!lock) throw new NotFoundException('SafeLock not found');
    if (lock.status !== 'active')
      throw new BadRequestException('Already released');

    const now = new Date();
    if (now < lock.maturityDate)
      throw new BadRequestException('SafeLock not matured yet');

    const user = lock.user;
    const payout = lock.amount + lock.interestEarned;
    user.balance += payout;
    await this.userRepo.save(user);

    lock.status = 'completed';
    await this.safeLockRepo.save(lock);

    const tx = this.txRepo.create({
      user,
      safeLock: lock,
      type: 'unlock',
      amount: payout,
      description: `SafeLock matured: ₦${payout} released.`,
    });
    await this.txRepo.save(tx);

    return lock;
  }

  // Get all SafeLocks for a specific user
  async getUserSafeLocks(userId: string): Promise<SafeLock[]> {
    return this.safeLockRepo.find({
      where: { user: { id: userId } },
      order: { startDate: 'DESC' },
    });
  }

  // Get total locked amount for a specific user
  async getUserTotalLocked(userId: string): Promise<number> {
    const locks = await this.getUserSafeLocks(userId);
    return locks
      .filter((l) => l.status === 'active')
      .reduce((sum, l) => sum + Number(l.amount), 0);
  }
}
