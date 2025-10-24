import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Contribution } from './contribution.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupSaving } from 'src/groupsaving/groupsaving.entity';
import { TargetSaving } from 'src/target-savings/target-savings.entity';
import { ContributeDto } from './dto/contribute.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionRepo: Repository<Contribution>,

    @InjectRepository(GroupSaving)
    private readonly groupRepo: Repository<GroupSaving>,

    @InjectRepository(TargetSaving)
    private readonly savingsRepo: Repository<TargetSaving>,
  ) {}

  async contribute(dto: ContributeDto, user: User): Promise<Contribution> {
    let target: GroupSaving | TargetSaving;

    const contributionData: Contribution = {
      amount: dto.amount,
      user,
      id: '',
      group: new GroupSaving(),
      saving: new TargetSaving(),
      createdAt: undefined,
      groupSaving: undefined,
    };

    if (dto.groupId) {
      // Use findOneBy with string ID
      target = await this.groupRepo.findOneBy({ id: dto.groupId });
      if (!target) throw new NotFoundException('Group not found');

      contributionData.group = target;
      contributionData.saving = undefined;

      target.collectedAmount += dto.amount;
      if (target.collectedAmount >= target.targetAmount)
        target.completed = true;
      await this.groupRepo.save(target);
    } else if (dto.savingId) {
      // Use findOneBy with string ID
      target = await this.savingsRepo.findOneBy({ id: dto.savingId });
      if (!target) throw new NotFoundException('Saving not found');

      contributionData.saving = target;
      contributionData.group = undefined;

      target.collectedAmount += dto.amount;
      if (target.collectedAmount >= target.targetAmount)
        target.completed = true;
      await this.savingsRepo.save(target);
    } else {
      throw new BadRequestException(
        'You must provide either savingId or groupId',
      );
    }

    const contribution = this.contributionRepo.create(contributionData);
    return await this.contributionRepo.save(contribution);
  }

  async getUserContributions(user: User): Promise<Contribution[]> {
    return this.contributionRepo.find({
      where: { user },
      relations: ['group', 'saving'],
      order: { createdAt: 'DESC' },
    });
  }

  async getContributionsForTarget(
    groupId?: string,
    savingId?: string,
  ): Promise<Contribution[]> {
    if (groupId) {
      const group = await this.groupRepo.findOneBy({ id: groupId });
      if (!group) throw new NotFoundException('Group not found');
      return this.contributionRepo.find({
        where: { group },
        relations: ['user'],
      });
    } else if (savingId) {
      const saving = await this.savingsRepo.findOneBy({ id: savingId });
      if (!saving) throw new NotFoundException('Saving not found');
      return this.contributionRepo.find({
        where: { saving },
        relations: ['user'],
      });
    } else {
      throw new BadRequestException('Provide either groupId or savingId');
    }
  }
}
