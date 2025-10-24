import { IsNumber, IsEnum } from 'class-validator';

export enum DepositChannel {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
}

export class DepositDto {
  @IsNumber()
  amount: number;

  @IsEnum(DepositChannel)
  channel: DepositChannel;
}
