import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('user_activity')
export class UserActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.activities)
  user: User;

  @Column()
  type: string;

  @Column()
  action: string;

  @Column()
  description: string;

  @Column({ type: 'numeric', default: 0 })
  amount: number;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  timestamp: Date;
}
