import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowsClassifierController } from './workflows-classifier.controller';
import { WorkflowsClassifierService } from './workflows-classifier.service';

describe('WorkflowsClassifierController', () => {
  let workflowsClassifierController: WorkflowsClassifierController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowsClassifierController],
      providers: [WorkflowsClassifierService],
    }).compile();

    workflowsClassifierController = app.get<WorkflowsClassifierController>(
      WorkflowsClassifierController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(workflowsClassifierController.getHello()).toBe('Hello World!');
    });
  });
});
