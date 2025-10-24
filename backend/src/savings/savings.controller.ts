import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('totals')
  async getTotalSavings(@Req() req) {
    const userId = req.user.id;
    const total = await this.savingsService.getTotalSavings(userId);
    return { total };
  }

  @Get('totals/:userId')
  async getTotalSavingsById(@Param('userId') userId: string) {
    const total = await this.savingsService.getTotalSavings(userId);
    return { total };
  }
}
