import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { OutboxService } from './outbox.service';

@Injectable()
export class OutboxProcessor {
  constructor(private readonly outboxService: OutboxService) {}

  @Interval(5000)
  async processOutbox() {
    await this.outboxService.dispatchPending();
  }
}
