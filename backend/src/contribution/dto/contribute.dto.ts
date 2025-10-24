import { IsString, IsOptional, IsNumber } from 'class-validator';

export class ContributeDto {
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsOptional()
  @IsString()
  savingId?: string;
}
