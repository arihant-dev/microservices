import { NestFactory } from '@nestjs/core';
import { WorkflowsNotificationModule } from './workflows-notification.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(WorkflowsNotificationModule);
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_URL || 'nats://localhost:4222'],
        queue: 'workflows-notification-service',
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3003);
}
bootstrap();
