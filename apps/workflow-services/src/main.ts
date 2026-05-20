import { NestFactory } from '@nestjs/core';
import { WorkflowServicesModule } from './workflow-services.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WORKFLOW_CREATE_QUEUE } from '@app/workflows';

async function bootstrap() {
  const app = await NestFactory.create(WorkflowServicesModule);
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_URL || 'nats://localhost:4222'],
        queue: 'workflows-service',
      },
    },
    { inheritAppConfig: true },
  );

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: WORKFLOW_CREATE_QUEUE,
        queueOptions: {
          durable: true,
        },
        noAck: false,
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
