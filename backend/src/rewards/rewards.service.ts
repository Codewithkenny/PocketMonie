import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reward } from './reward.entity';
import { User } from '../users/user.entity';
import { CreateRewardDto } from './dto/create-reward.dto';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private repo: Repository<Reward>,
  ) {}

  async create(dto: CreateRewardDto, user: User) {
    const reward = this.repo.create({ ...dto, user });
    return this.repo.save(reward);
  }

  async findAll(user: User) {
    return this.repo.find({ where: { user } });
  }

  async redeem(id: number, user: User) {
    const reward = await this.repo.findOne({ where: { id, user } });
    if (!reward) throw new NotFoundException('Reward not found');
    reward.redeemed = true;
    return this.repo.save(reward);
  }
}
