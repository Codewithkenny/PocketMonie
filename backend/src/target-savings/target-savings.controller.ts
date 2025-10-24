import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TargetSavingsService } from './target-savings.service';
import { UpdateTargetSavingDto } from './dto/update-target-savings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTargetSavingDto } from './dto/target-savings.dto';
import { Request } from 'express';
import { User } from '../users/user.entity';
import { PaystackService } from '../payments/paystack.service';

interface AuthRequest extends Request {
  user: User;
}

@Controller('savings/target')
@UseGuards(JwtAuthGuard)
export class TargetSavingsController {
  constructor(
    private readonly targetSavingsService: TargetSavingsService,
    private readonly paystackService: PaystackService,
  ) {}

  @Post()
  async create(@Body() dto: CreateTargetSavingDto, @Req() req: AuthRequest) {
    return await this.targetSavingsService.create(dto, req.user);
  }

  // Place static routes BEFORE dynamic parameter routes to avoid conflicts
  @Get('total')
  async getTotalSavings(@Req() req: AuthRequest) {
    return await this.targetSavingsService.getTotalSavings(req.user);
  }

  @Get()
  async findAll(@Req() req: AuthRequest) {
    return await this.targetSavingsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.targetSavingsService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTargetSavingDto,
    @Req() req: AuthRequest,
  ) {
    return this.targetSavingsService.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.targetSavingsService.remove(id, req.user);
  }

  @Post(':id/deposit')
  async deposit(
    @Param('id') id: string,
    @Body('amount') amount: number,
    @Req() req: AuthRequest,
  ) {
    const transaction = await this.paystackService.initializeTransaction(
      req.user.email,
      amount,
      id,
    );
    return {
      authorization_url: transaction.authorization_url,
      reference: transaction.reference,
    };
  }

  @Post('verify')
  async verifyPayment(
    @Body('reference') reference: string,
    @Body('targetId') targetId: string,
    @Req() req: AuthRequest,
  ) {
    const verification =
      await this.paystackService.verifyTransaction(reference);

    if (verification.status === 'success') {
      const updatedTarget = await this.targetSavingsService.deposit(
        req.user,
        targetId,
        verification.amount / 100,
      );
      return { message: 'Deposit successful', target: updatedTarget };
    } else {
      throw new Error('Payment verification failed');
    }
  }

  // Fetch transactions related to a target
  @Get(':id/transactions')
  async getTransactions(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.targetSavingsService.getTransactionsForTarget(id, req.user);
  }
}
