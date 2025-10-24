import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async findByTargetAndUser(
    targetId: string,
    user: User,
  ): Promise<Transaction[]> {
    return this.transactionRepo.find({
      where: {
        targetSaving: { id: targetId },
        user: { id: user.id },
      },
      order: { timestamp: 'DESC' },
    });
  }

  async findByFlexWalletAndUser(
    walletId: string,
    user: User,
  ): Promise<Transaction[]> {
    return this.transactionRepo.find({
      where: {
        flexWallet: { id: walletId },
        user: { id: user.id },
      },
      order: { timestamp: 'DESC' },
    });
  }
}
