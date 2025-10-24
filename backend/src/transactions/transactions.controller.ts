import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { Request } from 'express';
import { User } from '../users/user.entity';

interface AuthRequest extends Request {
  user: User;
}

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('target/:id')
  async getTransactionsByTarget(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ) {
    return this.transactionsService.findByTargetAndUser(id, req.user);
  }

  @Get('flex-wallet/:walletId')
  async getFlexWalletTransactions(
    @Param('walletId') walletId: string,
    @Req() req: AuthRequest,
  ) {
    return this.transactionsService.findByFlexWalletAndUser(walletId, req.user);
  }
}
