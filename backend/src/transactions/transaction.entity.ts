import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { FlexWallet } from '../flex-wallet/flex-wallet.entity';
import { SafeLock } from 'src/safelock/safelock.entity';
import { TargetSaving } from 'src/target-savings/target-savings.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['deposit', 'withdraw', 'transfer', 'lock', 'unlock'],
  })
  type: 'deposit' | 'withdraw' | 'transfer' | 'lock' | 'unlock';

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => SafeLock, { eager: true, nullable: true })
  @JoinColumn({ name: 'safeLockId' })
  safeLock?: SafeLock;

  @ManyToOne(() => TargetSaving, { nullable: true })
  @JoinColumn({ name: 'targetSavingId' })
  targetSaving?: TargetSaving;

  @ManyToOne(() => FlexWallet, (flexWallet) => flexWallet.transactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'flexWalletId' })
  flexWallet?: FlexWallet;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null): number => (value ? parseFloat(value) : 0),
    },
  })
  amount: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  reference?: string;

  @CreateDateColumn()
  timestamp: Date;
}
