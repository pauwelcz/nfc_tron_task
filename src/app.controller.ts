import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DataService } from './data/data.service';
import { CreateCustomerDto } from './data/dto/create-customer.dto';
import { UpdateCustomerDto } from './data/dto/update-customer.dto';

@Controller()
export class AppController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  findAll(): string {
    return this.dataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.dataService.findOne(id);
  }

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.dataService.create(createCustomerDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.dataService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.dataService.remove(id);
  }
}
