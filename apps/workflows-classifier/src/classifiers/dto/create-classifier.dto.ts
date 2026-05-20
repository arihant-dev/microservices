import { IsNumber, IsIn } from 'class-validator';

export class CreateClassifierDto {
  @IsNumber()
  workflowId!: number;

  @IsIn(['primary', 'secondary'])
  classification!: 'primary' | 'secondary';
}
