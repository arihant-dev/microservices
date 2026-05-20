import { Injectable } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { DataSource, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { WorkflowCreateEvent, WORKFLOW_CREATE_EVENT } from '@app/workflows';
import { OutboxEvent } from '../outbox/entities/outbox-event.entity';
import { OutboxService } from '../outbox/outbox.service';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    private dataSource: DataSource,
    private readonly outboxService: OutboxService,
  ) {}
  async create(createBuildingDto: CreateBuildingDto) {
    const newBuilding = await this.dataSource.transaction(async (manager) => {
      const buildingRepo = manager.getRepository(Building);
      const outboxRepo = manager.getRepository(OutboxEvent);
      const building = buildingRepo.create(createBuildingDto);
      const savedBuilding = await buildingRepo.save(building);
      const eventId = randomUUID();
      const payload: WorkflowCreateEvent = {
        eventId,
        buildingId: savedBuilding.id,
        name: `Workflow for Building ${savedBuilding.id}`,
        occurredAt: new Date().toISOString(),
      };
      const outboxEvent = outboxRepo.create({
        id: eventId,
        aggregateType: 'building',
        aggregateId: savedBuilding.id,
        eventType: WORKFLOW_CREATE_EVENT,
        payload,
        status: 'pending',
        nextRetryAt: new Date(),
      });
      await outboxRepo.save(outboxEvent);
      return savedBuilding;
    });
    await this.outboxService.dispatchPending();
    return newBuilding;
  }

  findAll() {
    return `This action returns all buildings`;
  }

  async findOne(id: number) {
    const building = await this.buildingRepository.findOneBy({ id });
    if (!building) {
      throw new Error(`Building with id ${id} not found`);
    }
    return building;
  }

  async update(id: number, updateBuildingDto: UpdateBuildingDto) {
    const building = await this.buildingRepository.preload({
      id,
      ...updateBuildingDto,
    });
    if (!building) {
      throw new Error(`Building with id ${id} not found`);
    }
    return this.buildingRepository.save(building);
  }

  async remove(id: number) {
    const building = await this.buildingRepository.findOneBy({ id });
    if (!building) {
      throw new Error(`Building with id ${id} not found`);
    }
    return this.buildingRepository.remove(building);
  }
}
