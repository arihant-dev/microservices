import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { LessThanOrEqual, Repository } from 'typeorm';
import { WORKFLOW_QUEUE_CLIENT } from '../constants';
import { OutboxEvent } from './entities/outbox-event.entity';

const MAX_RETRY_DELAY_MS = 30000;
const BASE_RETRY_DELAY_MS = 1000;

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  constructor(
    @InjectRepository(OutboxEvent)
    private readonly outboxRepository: Repository<OutboxEvent>,
    @Inject(WORKFLOW_QUEUE_CLIENT)
    private readonly workflowsClient: ClientProxy,
  ) {}

  async dispatchPending(limit = 10) {
    const now = new Date();
    const events = await this.outboxRepository.find({
      where: [
        { status: 'pending' },
        { status: 'failed', nextRetryAt: LessThanOrEqual(now) },
      ],
      order: { createdAt: 'ASC' },
      take: limit,
    });

    for (const event of events) {
      await this.publishEvent(event);
    }
  }

  private async publishEvent(event: OutboxEvent) {
    try {
      await lastValueFrom(
        this.workflowsClient.emit(event.eventType, event.payload),
      );
      event.status = 'sent';
      event.sentAt = new Date();
      event.lastError = null;
      event.nextRetryAt = null;
      await this.outboxRepository.save(event);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      event.status = 'failed';
      event.retryCount += 1;
      event.lastError = message;
      event.nextRetryAt = new Date(
        Date.now() + this.getRetryDelay(event.retryCount),
      );
      await this.outboxRepository.save(event);
      this.logger.error(
        `Failed to publish outbox event ${event.id} (${event.eventType}): ${message}`,
      );
    }
  }

  private getRetryDelay(retryCount: number) {
    return Math.min(MAX_RETRY_DELAY_MS, BASE_RETRY_DELAY_MS * 2 ** retryCount);
  }
}
