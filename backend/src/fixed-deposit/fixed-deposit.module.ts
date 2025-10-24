import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedDeposit } from './fixed-deposit.entity';
import { FixedDepositService } from './fixed-deposit.service';
import { FixedDepositController } from './fixed-deposit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FixedDeposit])],
  providers: [FixedDepositService],
  controllers: [FixedDepositController],
})
export class FixedDepositModule {}
