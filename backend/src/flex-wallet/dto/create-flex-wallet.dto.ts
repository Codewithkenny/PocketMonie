import { IsNumber, Min } from 'class-validator';

export class CreateFlexWalletDto {
  @IsNumber()
  @Min(100)
  initialDeposit: number;
}
