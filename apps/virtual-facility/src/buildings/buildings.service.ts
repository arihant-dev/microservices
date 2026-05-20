import { Inject, Injectable } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { Repository } from 'typeorm';
import { WORKFLOWS_SERVICE } from '../constants';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BuildingsService {
  constructor(@InjectRepository(Building) private buildingRepository: Repository<Building>, @Inject(WORKFLOWS_SERVICE) private readonly workflowsService: ClientProxy) {}
  async create(createBuildingDto: CreateBuildingDto) {
    const building = this.buildingRepository.create(createBuildingDto);
    const newBuilding = await this.buildingRepository.save(building);
    await this.createWorkflow(newBuilding.id);
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
    const building = await this.buildingRepository.preload({ id, ...updateBuildingDto });
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

  async createWorkflow(id: number) {
    console.log('Creating workflow for building with id:', id);
    const newWorkflow = await lastValueFrom(this.workflowsService.send('workflows.create', { buildingId: id, name: `Workflow for Building ${id}` } as CreateBuildingDto));

    // const newWorkflow = await response.json();
    console.log('New workflow created:', newWorkflow);
    return newWorkflow;
  }
}
