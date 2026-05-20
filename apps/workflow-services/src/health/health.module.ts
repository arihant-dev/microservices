import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus/dist/terminus.module';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController]
})
export class HealthModule {}
