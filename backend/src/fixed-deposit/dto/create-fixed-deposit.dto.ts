import { IsNumber, Min, Max } from 'class-validator';

export class CreateFixedDepositDto {
  @IsNumber()
  @Min(1000)
  amount: number;

  @IsNumber()
  @Min(1)
  @Max(48)
  durationMonths: number;
}
