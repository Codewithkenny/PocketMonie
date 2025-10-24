import { IsString, IsNumber, IsIn, IsNotEmpty } from 'class-validator';

export class CreateTargetSavingsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  amount: number;

  @IsIn(['daily', 'weekly', 'monthly'])
  frequency: string;

  @IsString()
  time: string;

  @IsIn(['manual', 'auto'])
  method: string;
}
