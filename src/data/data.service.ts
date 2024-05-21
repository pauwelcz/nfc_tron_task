import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    private sharedService: SharedService,
  ) {}

  async onModuleInit() {
    await this.customersRepository.delete({});

    const min = parseInt(process.env.RANDOM_MIN) || 25;
    const max = parseInt(process.env.RANDOM_MAX) || 50;
    const customersToCreate = [];
    for (
      let i = 0;
      i <= this.sharedService.getRandomIntFromInterval(min, max);
      i++
    ) {
      customersToCreate.push(this.create(this.createRandomCustomer()));
    }
    await Promise.all(customersToCreate);
  }

  createRandomCustomer(): CreateCustomerDto {
    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
    };
  }

  findAll(): Promise<Customer[]> {
    return this.customersRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customersRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} does not exist.`);
    }

    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    await this.isEmailUsed(createCustomerDto.email);
    const newCustomer = this.customersRepository.create({
      ...createCustomerDto,
    });
    return this.customersRepository.save(newCustomer);
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    await this.findOne(id);
    if (updateCustomerDto.email) {
      await this.isEmailUsed(updateCustomerDto.email, id);
    }

    await this.customersRepository.update(id, {
      ...updateCustomerDto,
      updated_at: new Date(),
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<Customer> {
    const customer = await this.findOne(id);
    return this.customersRepository.remove(customer);
  }

  private async isEmailUsed(email: string, id?: number) {
    const customer = await this.customersRepository.findOne({
      where: { email },
    });

    if (customer && customer.id !== id) {
      throw new BadRequestException(`Customer with this email exists.`);
    }
  }
}
