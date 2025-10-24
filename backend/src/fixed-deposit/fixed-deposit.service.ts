import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FixedDeposit } from './fixed-deposit.entity';
import { User } from '../users/user.entity';
import { CreateFixedDepositDto } from './dto/create-fixed-deposit.dto';

@Injectable()
export class FixedDepositService {
  constructor(
    @InjectRepository(FixedDeposit)
    private repo: Repository<FixedDeposit>,
  ) {}

  async create(dto: CreateFixedDepositDto, user: User) {
    const interestRate = this.calculateInterestRate(dto.durationMonths);
    const fd = this.repo.create({
      ...dto,
      interestRate,
      user,
    });
    return this.repo.save(fd);
  }

  calculateInterestRate(months: number): number {
    // Up to 22% per annum depending on duration
    if (months <= 12) return 12;
    if (months <= 24) return 15;
    if (months <= 36) return 18;
    return 22;
  }

  async findAll(user: User) {
    return this.repo.find({ where: { user } });
  }

  async findOne(id: string, user: User) {
    const fd = await this.repo.findOne({ where: { id, user } });
    if (!fd) throw new NotFoundException('Fixed deposit not found');
    return fd;
  }
}
