import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { Customer } from './data/entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataService } from './data/data.service';
import { SharedService } from './shared/shared.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let dataService: DataService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'mysql',
          database: process.env.MYSQL_DATABASE || 'nfc-tron',
          host: process.env.MYSQL_SQL_HOST || 'localhost',
          port: parseInt(process.env.MYSQL_SQL_PORT) || 3306,
          username: process.env.MYSQL_ROOT_PASSWORD || 'root',
          password: process.env.MYSQL_ROOT_PASSWORD || 'root',
          entities: [Customer],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Customer]),
      ],
      controllers: [AppController],
      providers: [DataService, SharedService],
    }).compile();

    appController = app.get<AppController>(AppController);
    dataService = app.get<DataService>(DataService);
  });

  describe('AppController', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });

    describe('GET /customers', () => {
      it('should return more than one customer', async () => {
        const customer1 = await appController.create(
          dataService.createRandomCustomer(),
        );
        const customer2 = await appController.create(
          dataService.createRandomCustomer(),
        );
        const customers = await appController.findAll();
        expect(customers.length).toBeGreaterThan(1);
        await appController.remove(customer1.id);
        await appController.remove(customer2.id);
      });
    });

    describe('POST /customers', () => {
      it('should create customer', async () => {
        const createCustomerDto = dataService.createRandomCustomer();
        const createdCustomer = await appController.create(createCustomerDto);
        expect(createdCustomer).toBeDefined();
        expect(createdCustomer.email).toBe(createCustomerDto.email);
        expect(createdCustomer.firstname).toBe(createCustomerDto.firstname);
        expect(createdCustomer.lastname).toBe(createCustomerDto.lastname);
        await appController.remove(createdCustomer.id);
      });
      it('should throw error (customer with email already exists in database)', async () => {
        const createCustomerDto = dataService.createRandomCustomer();
        const createdCustomer = await appController.create(createCustomerDto);

        await expect(appController.create(createCustomerDto)).rejects.toEqual(
          new BadRequestException('Customer with this email exists.'),
        );
        await appController.remove(createdCustomer.id);
      });
    });

    describe('GET /customers/{id}', () => {
      it('should throw NotFound exception', async () => {
        await expect(appController.findOne(0)).rejects.toEqual(
          new NotFoundException('Customer with id 0 does not exist.'),
        );
      });

      it('should find created customer', async () => {
        const createdCustomer = await appController.create(
          dataService.createRandomCustomer(),
        );
        const customer = await appController.findOne(createdCustomer.id);
        expect(customer.email).toBe(createdCustomer.email);
        expect(customer.firstname).toBe(createdCustomer.firstname);
        expect(customer.lastname).toBe(createdCustomer.lastname);
        await appController.remove(createdCustomer.id);
      });
    });

    describe('PATCH /customers/{id}', () => {
      it('should succesfully update customer', async () => {
        const createdCustomer = await appController.create(
          dataService.createRandomCustomer(),
        );
        expect(createdCustomer.email).toBe(createdCustomer.email);
        expect(createdCustomer.firstname).toBe(createdCustomer.firstname);
        expect(createdCustomer.lastname).toBe(createdCustomer.lastname);
        const updatedCustomer = await appController.update(createdCustomer.id, {
          email: createdCustomer.email,
          firstname: `${createdCustomer.firstname}1`,
          lastname: `${createdCustomer.lastname}1`,
        });
        expect(updatedCustomer.firstname).toBe(`${createdCustomer.firstname}1`);
        expect(updatedCustomer.lastname).toBe(`${createdCustomer.lastname}1`);
        await appController.remove(updatedCustomer.id);
      });

      it('should throw NotFound exception', async () => {
        await expect(appController.update(0, {})).rejects.toEqual(
          new NotFoundException('Customer with id 0 does not exist.'),
        );
      });

      it('should throw BadRequest exception', async () => {
        const customer1 = await appController.create(
          dataService.createRandomCustomer(),
        );
        const customer2 = await appController.create(
          dataService.createRandomCustomer(),
        );
        await expect(
          appController.update(customer2.id, { email: customer1.email }),
        ).rejects.toEqual(
          new BadRequestException('Customer with this email exists.'),
        );

        await appController.remove(customer1.id);
        await appController.remove(customer2.id);
      });
    });

    describe('DELETE /customers/{id}', () => {
      it('should throw NotFound exception', async () => {
        await expect(appController.remove(0)).rejects.toEqual(
          new NotFoundException('Customer with id 0 does not exist.'),
        );
      });

      it('should succesfully delete customer', async () => {
        const createdCustomer = await appController.create(
          dataService.createRandomCustomer(),
        );
        await appController.remove(createdCustomer.id);
        await expect(appController.findOne(createdCustomer.id)).rejects.toEqual(
          new NotFoundException(
            `Customer with id ${createdCustomer.id} does not exist.`,
          ),
        );
      });
    });
  });
});
