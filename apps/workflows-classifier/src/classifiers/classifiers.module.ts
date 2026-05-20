import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classifier } from './entities/classifier.entity';
import { ClassifiersService } from './classifiers.service';
import { ClassifiersController } from './classifiers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Classifier])],
  controllers: [ClassifiersController],
  providers: [ClassifiersService],
})
export class ClassifiersModule {}
