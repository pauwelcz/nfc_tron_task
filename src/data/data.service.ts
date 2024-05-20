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

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async onModuleInit() {
    await this.customersRepository.delete({});

    const customersToCreate = [];
    for (let i = 0; i <= this.getRandomIntFromInterval(1, 23); i++) {
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

  getRandomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
    const date = new Date();
    await this.checkEmail(createCustomerDto.email);
    const newCustomer = this.customersRepository.create({
      ...createCustomerDto,
      created_at: date,
      updated_at: date,
    });
    return this.customersRepository.save(newCustomer);
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    await this.findOne(id);
    if (updateCustomerDto.email) {
      await this.checkEmail(updateCustomerDto.email, id);
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

  private async checkEmail(email: string, id?: number) {
    const customer = await this.customersRepository.findOne({
      where: { email },
    });

    if (customer && customer.id !== id) {
      throw new BadRequestException(`Customer with this email exists.`);
    }
  }
}
