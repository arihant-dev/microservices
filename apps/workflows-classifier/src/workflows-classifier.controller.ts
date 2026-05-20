import { Controller, Get } from '@nestjs/common';
import { WorkflowsClassifierService } from './workflows-classifier.service';

@Controller()
export class WorkflowsClassifierController {
  constructor(private readonly workflowsClassifierService: WorkflowsClassifierService) {}

  @Get()
  getHello(): string {
    return this.workflowsClassifierService.getHello();
  }
}
