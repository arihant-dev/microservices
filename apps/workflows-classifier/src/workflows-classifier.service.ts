import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowsClassifierService {
  getHello(): string {
    return 'Hello World!';
  }
}
