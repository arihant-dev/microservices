import { NestFactory } from '@nestjs/core';
import { WorkflowsClassifierModule } from './workflows-classifier.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(WorkflowsClassifierModule);
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_URL || 'nats://localhost:4222'],
        queue: 'workflows-classifier-service',
      },
    },
    { inheritAppConfig: true }
  );

  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
