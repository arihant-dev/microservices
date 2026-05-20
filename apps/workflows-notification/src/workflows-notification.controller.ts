import { Controller, Get } from '@nestjs/common';
import { WorkflowsNotificationService } from './workflows-notification.service';

@Controller()
export class WorkflowsNotificationController {
  constructor(private readonly workflowsNotificationService: WorkflowsNotificationService) {}

  @Get()
  getHello(): string {
    return this.workflowsNotificationService.getHello();
  }
}
