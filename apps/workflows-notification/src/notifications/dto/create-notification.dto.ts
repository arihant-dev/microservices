import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  workflowId!: number;

  @IsString()
  message?: string;

  @IsOptional()
  @IsNumber()
  status?: number;
}
