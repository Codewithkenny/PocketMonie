import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TargetSaving } from '../target-savings/target-savings.entity';
import { Transaction } from '../transactions/transaction.entity';
import { UpdateTargetSavingDto } from '../target-savings/dto/update-target-savings.dto';
import { User } from '../users/user.entity';
import { CreateTargetSavingDto } from './dto/target-savings.dto';
import { UserActivityService } from '../user-activity/user-activity.service';
import Decimal from 'decimal.js';

@Injectable()
export class TargetSavingsService {
  constructor(
    @InjectRepository(TargetSaving)
    private targetSavingRepo: Repository<TargetSaving>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private activityService: UserActivityService,
  ) {}

  async create(
    dto: CreateTargetSavingDto,
    user: { id: string; email: string },
  ): Promise<TargetSaving> {
    if (!user || !user.id) throw new Error('User must be authenticated');

    const saving = this.targetSavingRepo.create({
      ...dto,
      user: user as any,
      currentAmount: '0',
      collectedAmount: '0',
      completed: false,
      contributions: [],
      isMatured: false,
      status: 'Live',
    } as unknown as Partial<TargetSaving>);

    const savedSaving = await this.targetSavingRepo.save(saving);

    // ✅ Log activity correctly
    await this.activityService.logActivity(
      user as User,
      'target_savings',
      'created',
      `Created target savings "${savedSaving.title}"`,
      parseFloat(savedSaving.targetAmount?.toString() || '0'),
    );

    return savedSaving;
  }

  async findAll(user: User): Promise<TargetSaving[]> {
    const targets = await this.targetSavingRepo.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });

    // ✅ Safely map numeric string fields
    return targets.map((t) => {
      const targetSaving = new TargetSaving();
      Object.assign(targetSaving, t);

      targetSaving.currentAmount = (
        parseFloat(t.currentAmount as any) || 0
      ).toString();
      targetSaving.targetAmount = (
        parseFloat(t.targetAmount as any) || 0
      ).toString();
      targetSaving.collectedAmount = (
        parseFloat(t.collectedAmount as any) || 0
      ).toString();

      return targetSaving;
    });
  }

  async findOne(id: string, user: User): Promise<TargetSaving> {
    const saving = await this.targetSavingRepo.findOne({
      where: { id, user },
      relations: ['user'],
    });
    if (!saving) throw new NotFoundException('Target Saving not found');
    return saving;
  }

  async update(
    id: string,
    dto: UpdateTargetSavingDto,
    user: User,
  ): Promise<TargetSaving> {
    const saving = await this.findOne(id, user);
    Object.assign(saving, dto);
    return this.targetSavingRepo.save(saving);
  }

  async deposit(
    user: User,
    targetId: string,
    amount: number,
    reference?: string,
  ) {
    const target = await this.findOne(targetId, user);

    const current = new Decimal(target.currentAmount || '0');
    const depositAmt = new Decimal(amount.toString());
    const newAmount = current.plus(depositAmt);

    target.currentAmount = newAmount.toFixed(2);

    if (newAmount.gte(new Decimal(target.targetAmount))) {
      target.status = 'Completed';
    }

    const savedTarget = await this.targetSavingRepo.save(target);

    const transaction = this.transactionRepo.create({
      user,
      targetSaving: savedTarget,
      amount: depositAmt.toNumber(),
      description: `Deposit of ₦${depositAmt.toFixed(2)}`,
      timestamp: new Date(),
      reference,
    });

    await this.transactionRepo.save(transaction);

    return savedTarget;
  }

  async remove(id: string, user: User): Promise<{ deleted: boolean }> {
    const saving = await this.findOne(id, user);
    await this.targetSavingRepo.remove(saving);
    return { deleted: true };
  }

  async getTotalSavings(user: User): Promise<{ total: number }> {
    const result = await this.targetSavingRepo
      .createQueryBuilder('target')
      .select('SUM(target.currentAmount)', 'sum')
      .where('target.userId = :userId', { userId: user.id })
      .getRawOne();

    return { total: parseFloat(result.sum) || 0 };
  }

  async getTransactionsForTarget(targetId: string, user: User) {
    return this.transactionRepo.find({
      where: {
        targetSaving: { id: targetId },
        user: { id: user.id },
      },
      order: { timestamp: 'DESC' },
    });
  }

  async calculateMaturity(saving: TargetSaving): Promise<TargetSaving> {
    const targetAmountDec = new Decimal(saving.targetAmount);
    const interestRateDec = new Decimal(saving.interestRate);
    const monthlyInterest = targetAmountDec
      .mul(interestRateDec.div(100))
      .div(12);
    const monthsPassed = new Decimal(saving.durationMonths);
    const currentAmount = targetAmountDec.plus(
      monthlyInterest.mul(monthsPassed),
    );
    saving.currentAmount = currentAmount.toFixed(2);
    saving.isMatured = monthsPassed.gte(new Decimal(saving.durationMonths));
    return this.targetSavingRepo.save(saving);
  }
}
