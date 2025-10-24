import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupSaving } from './groupsaving.entity';
import { Contribution } from '../contribution/contribution.entity';
import { GroupsService } from './groupsaving.service';
import { GroupsController } from './groupsaving.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GroupSaving, Contribution])],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}
