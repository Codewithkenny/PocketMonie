import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupSaving } from './groupsaving.entity';
import { User } from '../users/user.entity';
import { CreateGroupDto } from './dto/create-groupsaving.dto';
import { Contribution } from '../contribution/contribution.entity';
import { ContributeDto } from '../contribution/dto/contribute.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupSaving)
    private groupRepo: Repository<GroupSaving>,

    @InjectRepository(Contribution)
    private contributionRepo: Repository<Contribution>,
  ) {}

  async create(dto: CreateGroupDto, user: User): Promise<GroupSaving> {
    const group = this.groupRepo.create({ ...dto, user });
    return this.groupRepo.save(group);
  }

  async contribute(groupId: string, dto: ContributeDto, user: User) {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Group not found');

    const contribution = this.contributionRepo.create({
      amount: dto.amount,
      user,
      group,
    });

    await this.contributionRepo.save(contribution);

    group.collectedAmount += dto.amount;
    if (group.collectedAmount >= group.targetAmount) group.completed = true;

    return this.groupRepo.save(group);
  }

  async findAll(): Promise<GroupSaving[]> {
    return this.groupRepo.find({ relations: ['creator', 'contributions'] });
  }

  async findOne(id: string): Promise<GroupSaving> {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: ['creator', 'contributions'],
    });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }
}
