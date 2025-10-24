import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UserActivityService } from './user-activity.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../users/user.entity';

interface AuthRequest extends Request {
  user: User;
}

@Controller('savings')
export class UserActivityController {
  constructor(private activityService: UserActivityService) {}

  @UseGuards(JwtAuthGuard)
  @Get('activities')
  async getActivities(@Req() req: AuthRequest) {
    return this.activityService.getUserActivities(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Get('totals')
  async getTotals(@Req() req: AuthRequest) {
    const user = req.user;
    return this.activityService.getTotalSavings(user);
  }
}
