import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TargetSaving } from './target-savings.entity';
import { TargetSavingsService } from './target-savings.service';
import { TargetSavingsController } from './target-savings.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserActivityModule } from '../user-activity/user-activity.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TargetSaving]),
    JwtModule.register({}),
    UserActivityModule,
    TransactionsModule,
    PaymentsModule,
  ],
  providers: [TargetSavingsService, JwtAuthGuard],
  controllers: [TargetSavingsController],
  exports: [TargetSavingsService],
})
export class TargetSavingsModule {}
