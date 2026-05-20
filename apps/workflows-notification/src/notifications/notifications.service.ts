import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(@InjectRepository(Notification) private notificationRepository: Repository<Notification>) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create(createNotificationDto);
    this.logger.debug(`Creating notification for workflowId: ${createNotificationDto.workflowId} with message: ${createNotificationDto.message}`);
    return this.notificationRepository.save(notification);
  }

  async notifyWorkflow(workflowId: number, message: string) {
    this.logger.debug(`Notifying workflow: ${workflowId} with message: ${message}`);
    
    return;
  }

  findAll() {
    return `This action returns all notifications`;
  }

  async findOne(id: number) {
    const notification = await this.notificationRepository.findOneBy({ id });
    if (!notification) {
      throw new Error(`Notification with id ${id} not found`);
    }
    return notification;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.notificationRepository.preload({ id, ...updateNotificationDto });
    if (!notification) {
      throw new Error(`Notification with id ${id} not found`);
    }
    return this.notificationRepository.save(notification);
  }

  async remove(id: number) {
    const notification = await this.notificationRepository.findOneBy({ id });
    if (!notification) {
      throw new Error(`Notification with id ${id} not found`);
    }
    return this.notificationRepository.remove(notification);
  }
}
