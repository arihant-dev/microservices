import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowServicesController } from './workflow-services.controller';
import { WorkflowServicesService } from './workflow-services.service';

describe('WorkflowServicesController', () => {
  let workflowServicesController: WorkflowServicesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowServicesController],
      providers: [WorkflowServicesService],
    }).compile();

    workflowServicesController = app.get<WorkflowServicesController>(WorkflowServicesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(workflowServicesController.getHello()).toBe('Hello World!');
    });
  });
});
