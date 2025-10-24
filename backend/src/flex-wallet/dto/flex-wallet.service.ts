import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlexWallet } from '../flex-wallet.entity';
import { User } from '../../users/user.entity';
import { CreateFlexWalletDto } from './create-flex-wallet.dto';

@Injectable()
export class FlexWalletService {
  constructor(
    @InjectRepository(FlexWallet)
    private repo: Repository<FlexWallet>,
  ) {}

  async create(dto: CreateFlexWalletDto, user: User) {
    const wallet = this.repo.create({
      balance: dto.initialDeposit,
      user,
    });
    return this.repo.save(wallet);
  }

  async findAll(user: User) {
    return this.repo.find({ where: { user } });
  }

  async findOne(id: string, user: User) {
    const wallet = await this.repo.findOne({ where: { id, user } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async deposit(id: string, amount: number, user: User) {
    const wallet = await this.findOne(id, user);
    wallet.balance += amount;
    return this.repo.save(wallet);
  }

  async withdraw(id: string, amount: number, user: User) {
    const wallet = await this.findOne(id, user);
    if (wallet.balance < amount)
      throw new BadRequestException('Insufficient balance');
    wallet.balance -= amount;
    return this.repo.save(wallet);
  }
}
