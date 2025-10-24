import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { SafeLockService } from './safelock.service';

@Controller('safelock')
export class SafeLockController {
  constructor(private readonly safeLockService: SafeLockService) {}

  /**
   * Create a new SafeLock
   */
  @Post('create/:userId')
  async createSafeLock(
    @Param('userId') userId: string,
    @Body('amount') amount: number,
    @Body('duration') durationInDays: number,
  ) {
    return this.safeLockService.createSafeLock(userId, amount, durationInDays);
  }

  /**
   * Release matured SafeLock funds
   */
  @Post('release/:lockId')
  async releaseSafeLock(@Param('lockId') lockId: string) {
    return this.safeLockService.releaseSafeLock(lockId);
  }

  /**
   * Get all SafeLocks for a specific user
   */
  @Get(':userId')
  async getUserSafeLocks(@Param('userId') userId: string) {
    return this.safeLockService.getUserSafeLocks(userId);
  }

  /**
   * Get total locked funds for user (optional dashboard endpoint)
   */
  @Get('total/:userId')
  async getUserTotalLocked(@Param('userId') userId: string) {
    return this.safeLockService.getUserTotalLocked(userId);
  }
}
