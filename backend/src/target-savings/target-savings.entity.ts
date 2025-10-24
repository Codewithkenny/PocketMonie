import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class TargetSaving {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('decimal', { precision: 15, scale: 2 })
  targetAmount: string;

  @Column({ type: 'enum', enum: ['daily', 'weekly', 'monthly'] })
  frequency: 'daily' | 'weekly' | 'monthly';

  @Column()
  preferredTime: string;

  @Column({ type: 'int', default: 0 })
  durationMonths: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  interestRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  currentAmount: string;

  @Column({ default: false })
  isMatured: boolean;

  @Column({ default: 'Live' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  maturityDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  collectedAmount: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'json', nullable: true })
  contributions: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.groupSavings, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @OneToMany(() => TargetSaving, (saving) => saving.user, { cascade: true })
  targetSavings: TargetSaving[];

  // Proper OneToMany relation with Transaction entity
  @OneToMany(() => Transaction, (transaction) => transaction.targetSaving)
  transactions: Transaction[];

  @BeforeInsert()
  calculateInterest() {
    if (this.durationMonths === undefined) return;
    if (this.durationMonths <= 12) this.interestRate = 12;
    else if (this.durationMonths <= 24) this.interestRate = 16;
    else if (this.durationMonths <= 36) this.interestRate = 20;
    else this.interestRate = 22;

    if (!this.durationMonths) return;
    const today = new Date();
    this.maturityDate = new Date(
      today.setMonth(today.getMonth() + this.durationMonths),
    );
  }
}
