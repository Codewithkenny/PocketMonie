import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RewardService } from './rewards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRewardDto } from './dto/create-reward.dto';

@Controller('rewards')
@UseGuards(JwtAuthGuard)
export class RewardController {
  constructor(private readonly service: RewardService) {}

  @Post()
  create(@Body() dto: CreateRewardDto, @Req() req) {
    return this.service.create(dto, req.user);
  }

  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user);
  }

  @Post(':id/redeem')
  redeem(@Param('id') id: number, @Req() req) {
    return this.service.redeem(id, req.user);
  }
}
