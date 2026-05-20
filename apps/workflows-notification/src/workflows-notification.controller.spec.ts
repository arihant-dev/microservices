import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowsNotificationController } from './workflows-notification.controller';
import { WorkflowsNotificationService } from './workflows-notification.service';

describe('WorkflowsNotificationController', () => {
  let workflowsNotificationController: WorkflowsNotificationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowsNotificationController],
      providers: [WorkflowsNotificationService],
    }).compile();

    workflowsNotificationController = app.get<WorkflowsNotificationController>(WorkflowsNotificationController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(workflowsNotificationController.getHello()).toBe('Hello World!');
    });
  });
});
