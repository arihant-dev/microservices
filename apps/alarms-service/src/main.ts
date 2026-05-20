import { NestFactory } from '@nestjs/core';
import { AlarmsServiceModule } from './alarms-service.module';
import { Transport } from '@nestjs/microservices/enums/transport.enum';

async function bootstrap() {
  const app = await NestFactory.create(AlarmsServiceModule);

  app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_URL || 'nats://localhost:4222'],
      queue: 'alarms-service',
    },
  },{inheritAppConfig: true});

  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
