import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SafeLock } from './safelock.entity';
import { SafeLockService } from './safelock.service';
import { SafeLockController } from './safelock.controller';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SafeLock, User, Transaction])],
  providers: [SafeLockService],
  controllers: [SafeLockController],
  exports: [SafeLockService],
})
export class SafeLockModule {}
