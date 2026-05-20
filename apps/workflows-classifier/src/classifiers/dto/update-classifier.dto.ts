import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreateClassifierDto } from './create-classifier.dto';

export class UpdateClassifierDto extends PartialType(CreateClassifierDto) {}

export class ClassifyWorkflowDto {
  @IsNumber()
  workflowId!: number;
}
