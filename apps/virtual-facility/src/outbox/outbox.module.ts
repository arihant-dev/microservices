import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WORKFLOW_CREATE_QUEUE } from '@app/workflows';
import { WORKFLOW_QUEUE_CLIENT } from '../constants';
import { OutboxEvent } from './entities/outbox-event.entity';
import { OutboxProcessor } from './outbox.processor';
import { OutboxService } from './outbox.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OutboxEvent]),
    ClientsModule.register([
      {
        name: WORKFLOW_QUEUE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: WORKFLOW_CREATE_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [OutboxService, OutboxProcessor],
  exports: [OutboxService],
})
export class OutboxModule {}
