import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WORKFLOW_CREATE_EVENT } from '@app/workflows';
import type {
  CreateWorkflowDto,
  UpdateWorkflowDto,
  WorkflowCreateEvent,
} from '@app/workflows';
import { EventPattern, MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @MessagePattern('workflows.create')
  create(@Payload() createWorkflowDto: CreateWorkflowDto) {
    return this.workflowsService.create(createWorkflowDto);
  }

  @EventPattern(WORKFLOW_CREATE_EVENT)
  async handleWorkflowCreateEvent(
    @Payload() payload: WorkflowCreateEvent,
    @Ctx() context: RmqContext,
  ) {
    await this.workflowsService.createFromEvent(payload);
    const channel = context.getChannelRef() as Channel;
    const message = context.getMessage() as Message;
    channel.ack(message);
  }

  @Get()
  findAll() {
    return this.workflowsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workflowsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
  ) {
    return this.workflowsService.update(+id, updateWorkflowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workflowsService.remove(+id);
  }
}
