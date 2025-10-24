import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FlexWallet } from './flex-wallet.entity';
import { CreateFlexWalletDto } from './dto/create-flex-wallet.dto';

@Injectable()
export class FlexWalletService {
  constructor(
    @InjectRepository(FlexWallet)
    private readonly walletRepository: Repository<FlexWallet>,
    private readonly dataSource: DataSource,
  ) {}

  async findOneById(id: string, user: any) {
    const wallet = await this.walletRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async findOneByUserId(userId: string, _user: any) {
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'transactions'],
    });
    if (!wallet) {
      throw new NotFoundException('Wallet not found for this user');
    }
    return wallet;
  }

  async create(dto: CreateFlexWalletDto, user: any) {
    const newWallet = this.walletRepository.create({
      ...dto,
      user: { id: user.id },
    });
    return this.walletRepository.save(newWallet);
  }

  async findAll(user: any) {
    return this.walletRepository.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
  }

  async deposit(id: string, amount: number, user: any) {
    if (amount <= 0) {
      throw new BadRequestException('Deposit amount must be greater than zero');
    }

    return await this.dataSource.transaction(async (manager) => {
      const wallet = await manager.findOne(FlexWallet, {
        where: { id, user: { id: user.id } },
        lock: { mode: 'pessimistic_write' },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      wallet.balance += amount;

      return manager.save(wallet);
    });
  }

  async withdraw(id: string, amount: number, user: any) {
    if (amount <= 0) {
      throw new BadRequestException(
        'Withdraw amount must be greater than zero',
      );
    }
    return await this.dataSource.transaction(async (manager) => {
      const wallet = await manager.findOne(FlexWallet, {
        where: { id, user: { id: user.id } },
        lock: { mode: 'pessimistic_write' },
      });
      if (!wallet) throw new NotFoundException('Wallet not found');
      if (wallet.balance < amount)
        throw new BadRequestException('Insufficient balance');
      wallet.balance -= amount;
      return manager.save(wallet);
    });
  }
}
