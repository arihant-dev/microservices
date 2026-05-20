import { Controller, Get } from '@nestjs/common';
import { HealthCheck, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { HealthCheckService } from '@nestjs/terminus/dist/health-check/health-check.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  isHealthy() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
