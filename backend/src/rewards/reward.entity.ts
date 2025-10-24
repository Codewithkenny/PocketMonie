import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Reward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @Column({ default: false })
  redeemed: boolean;

  @ManyToOne(() => User, (user) => user.rewards)
  user: User;

  @OneToMany(() => Reward, (reward) => reward.user, { cascade: true })
  rewards: Reward[];

  @CreateDateColumn()
  createdAt: Date;
}
