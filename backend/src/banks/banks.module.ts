import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';

@Module({
  imports: [HttpModule],
  controllers: [BanksController],
  providers: [BanksService],
  exports: [BanksService],
})
export class BanksModule {}
