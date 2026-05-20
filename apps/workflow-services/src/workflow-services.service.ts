import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowServicesService {
  getHello(): string {
    return 'Hello World!';
  }
}
