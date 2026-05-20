import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ClassifiersService } from './classifiers.service';
import { CreateClassifierDto } from './dto/create-classifier.dto';
import { UpdateClassifierDto } from './dto/update-classifier.dto';

@Controller('classifiers')
export class ClassifiersController {
  constructor(private readonly classifiersService: ClassifiersService) {}

  @Post()
  create(@Body() createClassifierDto: CreateClassifierDto) {
    return this.classifiersService.create(createClassifierDto);
  }

  @Post('classify/:workflowId')
  async classify(@Param('workflowId') workflowId: string) {
    return this.classifiersService.classify(+workflowId);
  }

  @MessagePattern('workflows.classify')
  async handleClassify(@Payload() data: { workflowId: number }) {
    return this.classifiersService.classify(data.workflowId);
  }

  @Get()
  findAll() {
    return this.classifiersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classifiersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassifierDto: UpdateClassifierDto) {
    return this.classifiersService.update(+id, updateClassifierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classifiersService.remove(+id);
  }
}
