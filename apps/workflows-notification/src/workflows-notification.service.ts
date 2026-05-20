import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowsNotificationService {
  getHello(): string {
    return 'Hello World!';
  }
}
