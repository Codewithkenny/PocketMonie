import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivityService } from './user-activity.service';
import { UserActivityController } from './user-activity.controller';
import { UserActivity } from './user-activity.entity';
import { TargetSaving } from '../target-savings/target-savings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserActivity, TargetSaving])],
  providers: [UserActivityService],
  controllers: [UserActivityController],
  exports: [UserActivityService],
})
export class UserActivityModule {}
