import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class AlarmsGeneratorService {
  constructor(
    @Inject('ALARMS_SERVICE') private readonly alarmsServiceClient: ClientProxy,
  ) {}

  @Interval(10000)
  generateAlarms() {
    const alarmCreatedEvent = {
      id: Math.random().toString(36).substring(2, 9),
      buildingId: Math.floor(Math.random() * 100) + 1,
      message: 'Alarm generated',
      timestamp: new Date(),
    };
    this.alarmsServiceClient.emit('alarm.create', alarmCreatedEvent);
  }
}
