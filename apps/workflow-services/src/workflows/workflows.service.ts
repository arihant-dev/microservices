import { Injectable, Logger } from '@nestjs/common';
import { CreateWorkflowDto, UpdateWorkflowDto } from '@app/workflows';
import { InjectRepository } from '@nestjs/typeorm';
import { Workflow } from './entities/workflow.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);
  constructor(@InjectRepository(Workflow) private workflowRepository: Repository<Workflow>) {}
  async create(createWorkflowDto: CreateWorkflowDto) {
      const workflow = this.workflowRepository.create(createWorkflowDto);
      this.logger.debug(`Creating workflow with name: ${createWorkflowDto.name} for buildingId: ${createWorkflowDto.buildingId}`);
      return this.workflowRepository.save(workflow);
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
    const workflow = await this.workflowRepository.preload({ id, ...updateWorkflowDto });
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
