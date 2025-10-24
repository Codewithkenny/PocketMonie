import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { GroupSaving } from '../groupsaving/groupsaving.entity';
import { TargetSaving } from 'src/target-savings/target-savings.entity';

@Entity()
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @ManyToOne(() => User, (user) => user.contributions)
  user: User;

  @ManyToOne(() => GroupSaving, (group) => group.contributions, {
    nullable: true,
  })
  group: GroupSaving;

  @ManyToOne(() => TargetSaving, (saving) => saving.contributions, {
    nullable: true,
  })
  saving: TargetSaving;

  @CreateDateColumn()
  createdAt: Date;
  groupSaving: any;
}
