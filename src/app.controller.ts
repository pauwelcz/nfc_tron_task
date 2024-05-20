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
import { Customer } from './data/entities/customer.entity';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Currency } from '@faker-js/faker';

@ApiTags('customers')
@Controller('customers')
export class AppController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  @ApiOperation({ summary: 'Request finds all customers.' })
  @ApiOkResponse()
  findAll(): Promise<Customer[]> {
    return this.dataService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Request finds the customer by id.' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiOkResponse()
  findOne(@Param('id') id: number): Promise<Customer> {
    return this.dataService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Request creates new customer.' })
  @ApiResponse({ status: 201, description: 'Customer is created.' })
  @ApiResponse({
    status: 400,
    description: 'Bad request or customer with email exists in database.',
  })
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.dataService.create(createCustomerDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Request updates existing customer.' })
  @ApiResponse({
    status: 400,
    description: 'Bad request or customer with email exists in database.',
  })
  @ApiResponse({ status: 404, description: 'Customer to update not found' })
  update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.dataService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Request deletes existing customer.' })
  @ApiResponse({ status: 404, description: 'Customer to delete not found' })
  remove(@Param('id') id: number): Promise<Customer> {
    return this.dataService.remove(id);
  }
}
