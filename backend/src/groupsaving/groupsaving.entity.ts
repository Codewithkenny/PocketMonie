import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Contribution } from '../contribution/contribution.entity';

@Entity('group_savings')
export class GroupSaving {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  targetAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  collectedAmount: number;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => User, (user) => user.groupSavings)
  user: User;

  @OneToMany(() => Contribution, (contrib) => contrib.groupSaving, {
    cascade: true,
  })
  contributions: Contribution[];

  @CreateDateColumn()
  createdAt: Date;
}
