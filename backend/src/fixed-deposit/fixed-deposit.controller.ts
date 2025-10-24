import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FixedDepositService } from './fixed-deposit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFixedDepositDto } from './dto/create-fixed-deposit.dto';

@Controller('fixed-deposit')
@UseGuards(JwtAuthGuard)
export class FixedDepositController {
  constructor(private readonly service: FixedDepositService) {}

  @Post()
  create(@Body() dto: CreateFixedDepositDto, @Req() req) {
    return this.service.create(dto, req.user);
  }

  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.service.findOne(id, req.user);
  }
}
