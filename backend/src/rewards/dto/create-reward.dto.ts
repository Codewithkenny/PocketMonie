import { IsNumber, Min, IsString } from 'class-validator';

export class CreateRewardDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  description: string;
}
