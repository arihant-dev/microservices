import { Controller, Get, Logger } from '@nestjs/common';
import { AlarmsServiceService } from './alarms-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AlarmsServiceController {
  private readonly logger = new Logger(AlarmsServiceController.name);
  @EventPattern('alarm.create')
  createAlarm(@Payload() alarmData: any) {
    this.logger.log('Received alarm.create data: ' + JSON.stringify(alarmData));
  }
}
