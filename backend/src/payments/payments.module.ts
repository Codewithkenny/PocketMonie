import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaystackService } from './paystack.service';
import { PaystackWebhookController } from './paystack-webhook.controller';
import { UsersService } from '../users/users.service';
import { TargetSavingsModule } from '../target-savings/target-savings.module';
import { UserActivityModule } from '../user-activity/user-activity.module';
import { TargetSaving } from '../target-savings/target-savings.entity';
import { Transaction } from '../transactions/transaction.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    forwardRef(() => TargetSavingsModule),
    TypeOrmModule.forFeature([TargetSaving, Transaction, User]),
    UserActivityModule,
  ],

  providers: [PaystackService, UsersService],
  controllers: [PaystackWebhookController],
  exports: [PaystackService],
})
export class PaymentsModule {}
