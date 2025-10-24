import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FlexWalletService } from './flex-wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFlexWalletDto } from './dto/create-flex-wallet.dto';

@Controller('flex-wallet')
@UseGuards(JwtAuthGuard)
export class FlexWalletController {
  constructor(private readonly service: FlexWalletService) {}

  @Post('create')
  create(@Body() dto: CreateFlexWalletDto, @Req() req) {
    return this.service.create(dto, req.user);
  }

  @Get(':id')
  getWalletById(@Param('id', new ParseUUIDPipe()) id: string, @Req() req) {
    return this.service.findOneById(id, req.user);
  }

  @Get('user/:userId')
  getWalletByUserId(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Req() req,
  ) {
    return this.service.findOneByUserId(userId, req.user);
  }

  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user);
  }

  @Post('deposit/:id')
  deposit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('amount') amount: number,
    @Req() req,
  ) {
    return this.service.deposit(id, amount, req.user);
  }

  @Post(':id/withdraw')
  withdraw(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('amount') amount: number,
    @Req() req,
  ) {
    return this.service.withdraw(id, amount, req.user);
  }
}
