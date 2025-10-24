import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class FixedDeposit {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column('int')
  durationMonths: number;

  @Column('decimal', { precision: 5, scale: 2, default: 10 })
  interestRate: number;

  @Column({ default: false })
  matured: boolean;

  @ManyToOne(() => User, (user) => user.fixedDeposits)
  user: User;

  @OneToMany(() => FixedDeposit, (fixed) => fixed.user, { cascade: true })
  fixedDeposits: FixedDeposit[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
