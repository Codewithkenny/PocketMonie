import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TargetSaving } from '../target-savings/target-savings.entity';
import { FlexWallet } from '../flex-wallet/flex-wallet.entity';
import { Transaction } from '../transactions/transaction.entity';
import { SafeLock } from '../safelock/safelock.entity';
import { GroupSaving } from '../groupsaving/groupsaving.entity';
import { Contribution } from '../contribution/contribution.entity';
import { UserActivity } from '../user-activity/user-activity.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  timezone: string;

  @OneToMany(() => Transaction, (tx) => tx.user)
  transactions: Transaction[];

  @OneToMany(() => FlexWallet, (wallet) => wallet.user, { cascade: true })
  flexWallets: FlexWallet[];

  @OneToMany(() => TargetSaving, (saving) => saving.user, { cascade: true })
  targetSavings: TargetSaving[];

  @OneToMany(() => SafeLock, (lock) => lock.user, { cascade: true })
  safeLocks: SafeLock[];

  @OneToMany(() => GroupSaving, (group) => group.user, { cascade: true })
  groupSavings: GroupSaving[];

  @OneToMany(() => Contribution, (contrib) => contrib.user, { cascade: true })
  contributions: Contribution[];

  @OneToMany(() => UserActivity, (activity) => activity.user, { cascade: true })
  activities: UserActivity[];
  fixedDeposits: any;
  rewards: any;
  balance: number;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}
