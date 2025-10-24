// create-target-saving.dto.ts
import { IsString, IsNumber, IsEnum, Min } from 'class-validator';

export class CreateTargetSavingDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(1)
  targetAmount: number;

  @IsEnum(['daily', 'weekly', 'monthly'])
  frequency: 'daily' | 'weekly' | 'monthly';

  @IsString()
  preferredTime: string;

  @IsNumber()
  @Min(1)
  durationMonths: number;
}
