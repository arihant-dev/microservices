import { Controller, Get } from '@nestjs/common';
import { WorkflowServicesService } from './workflow-services.service';

@Controller()
export class WorkflowServicesController {
  constructor(
    private readonly workflowServicesService: WorkflowServicesService,
  ) {}

  @Get()
  getHello(): string {
    return this.workflowServicesService.getHello();
  }
}
