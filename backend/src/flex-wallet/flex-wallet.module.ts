import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlexWallet } from './flex-wallet.entity';
import { FlexWalletService } from './flex-wallet.service';
import { FlexWalletController } from './flex-wallet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FlexWallet])],
  providers: [FlexWalletService],
  controllers: [FlexWalletController],
})
export class FlexWalletModule {}
