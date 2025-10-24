import { PartialType } from '@nestjs/mapped-types';
import { CreateTargetSavingDto } from './target-savings.dto';

export class UpdateTargetSavingDto extends PartialType(CreateTargetSavingDto) {}
