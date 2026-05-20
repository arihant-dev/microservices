import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowsNotificationController } from './workflows-notification.controller';
import { WorkflowsNotificationService } from './workflows-notification.service';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: +(process.env.POSTGRES_PORT || 5432),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'workflows-notification',
      autoLoadEntities: true,
      synchronize: true,
    }),
    NotificationsModule,
  ],
  controllers: [WorkflowsNotificationController],
  providers: [WorkflowsNotificationService],
})
export class WorkflowsNotificationModule {}
