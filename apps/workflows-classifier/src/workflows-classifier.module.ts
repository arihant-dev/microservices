import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowsClassifierController } from './workflows-classifier.controller';
import { WorkflowsClassifierService } from './workflows-classifier.service';
import { ClassifiersModule } from './classifiers/classifiers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: +(process.env.POSTGRES_PORT || 5432),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'workflows-classifier',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ClassifiersModule,
  ],
  controllers: [WorkflowsClassifierController],
  providers: [WorkflowsClassifierService],
})
export class WorkflowsClassifierModule {}
