import { Injectable, Logger } from '@nestjs/common';
import {
  CreateWorkflowDto,
  UpdateWorkflowDto,
  WorkflowCreateEvent,
  WORKFLOW_CREATE_EVENT,
} from '@app/workflows';
import { InjectRepository } from '@nestjs/typeorm';
import { Workflow } from './entities/workflow.entity';
import { DataSource, Repository } from 'typeorm';
import { InboxEntry } from '../inbox/entities/inbox-entry.entity';

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);
  constructor(
    @InjectRepository(Workflow)
    private workflowRepository: Repository<Workflow>,
    private dataSource: DataSource,
  ) {}
  async create(createWorkflowDto: CreateWorkflowDto) {
    const workflow = this.workflowRepository.create(createWorkflowDto);
    this.logger.debug(
      `Creating workflow with name: ${createWorkflowDto.name} for buildingId: ${createWorkflowDto.buildingId}`,
    );
    return this.workflowRepository.save(workflow);
  }

  async createFromEvent(event: WorkflowCreateEvent) {
    await this.dataSource.transaction(async (manager) => {
      const inboxRepo = manager.getRepository(InboxEntry);
      const workflowRepo = manager.getRepository(Workflow);
      const existing = await inboxRepo.findOneBy({ eventId: event.eventId });
      if (existing?.processedAt) {
        this.logger.debug(
          `Skipping already processed event ${event.eventId} (${WORKFLOW_CREATE_EVENT})`,
        );
        return;
      }
      const inboxEntry =
        existing ??
        inboxRepo.create({
          eventId: event.eventId,
          eventType: WORKFLOW_CREATE_EVENT,
          payload: event,
          processedAt: null,
        });
      if (!existing) {
        await inboxRepo.save(inboxEntry);
      }
      const workflow = workflowRepo.create({
        name: event.name,
        buildingId: event.buildingId,
      });
      await workflowRepo.save(workflow);
      await inboxRepo.update(
        { eventId: event.eventId },
        { processedAt: new Date() },
      );
    });
  }

  findAll() {
    return `This action returns all workflows`;
  }

  async findOne(id: number) {
    const workflow = await this.workflowRepository.findOneBy({ id });
    if (!workflow) {
      throw new Error(`Workflow with id ${id} not found`);
    }
    return workflow;
  }

  async update(id: number, updateWorkflowDto: UpdateWorkflowDto) {
    const workflow = await this.workflowRepository.preload({
      id,
      ...updateWorkflowDto,
    });
    if (!workflow) {
      throw new Error(`Workflow with id ${id} not found`);
    }
    return this.workflowRepository.save(workflow);
  }

  async remove(id: number) {
    const workflow = await this.workflowRepository.findOneBy({ id });
    if (!workflow) {
      throw new Error(`Workflow with id ${id} not found`);
    }
    return this.workflowRepository.remove(workflow);
  }
}
