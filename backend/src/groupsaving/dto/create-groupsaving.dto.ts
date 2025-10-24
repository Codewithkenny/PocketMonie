import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(1000)
  targetAmount: number;

  @IsNumber()
  @Min(1)
  @Max(48)
  durationMonths: number;
}
