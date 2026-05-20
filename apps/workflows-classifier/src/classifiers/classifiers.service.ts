import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassifierDto } from './dto/create-classifier.dto';
import { UpdateClassifierDto } from './dto/update-classifier.dto';
import { Classifier } from './entities/classifier.entity';

@Injectable()
export class ClassifiersService {
  private readonly logger = new Logger(ClassifiersService.name);

  constructor(@InjectRepository(Classifier) private classifierRepository: Repository<Classifier>) {}

  async create(createClassifierDto: CreateClassifierDto) {
    const classifier = this.classifierRepository.create(createClassifierDto);
    this.logger.debug(`Creating classifier for workflowId: ${createClassifierDto.workflowId} with classification: ${createClassifierDto.classification}`);
    return this.classifierRepository.save(classifier);
  }

  async classify(workflowId: number): Promise<{ classification: 'primary' | 'secondary' }> {
    this.logger.debug(`Classifying workflow: ${workflowId}`);
    // Simple classification logic - in production, this would be more complex
    const classification = workflowId % 2 === 0 ? 'primary' : 'secondary';
    
    const classifier = this.classifierRepository.create({
      workflowId,
      classification,
    });
    
    await this.classifierRepository.save(classifier);
    return { classification };
  }

  findAll() {
    return `This action returns all classifiers`;
  }

  async findOne(id: number) {
    const classifier = await this.classifierRepository.findOneBy({ id });
    if (!classifier) {
      throw new Error(`Classifier with id ${id} not found`);
    }
    return classifier;
  }

  async update(id: number, updateClassifierDto: UpdateClassifierDto) {
    const classifier = await this.classifierRepository.preload({ id, ...updateClassifierDto });
    if (!classifier) {
      throw new Error(`Classifier with id ${id} not found`);
    }
    return this.classifierRepository.save(classifier);
  }

  async remove(id: number) {
    const classifier = await this.classifierRepository.findOneBy({ id });
    if (!classifier) {
      throw new Error(`Classifier with id ${id} not found`);
    }
    return this.classifierRepository.remove(classifier);
  }
}
