import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { SharedService } from '../shared/shared.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as customersExample from './test-templates/customers.json';

describe('DataService', () => {
  let service: DataService;
  let mockRepository: Repository<Customer>;
  let mockedCustomers: Customer[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataService,
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository<Customer>,
        },
        SharedService,
      ],
    }).compile();

    service = module.get<DataService>(DataService);
    mockRepository = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );

    mockedCustomers = customersExample.map((item) => {
      return {
        ...item,
        created_at: new Date(),
        updated_at: new Date(),
      };
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
      jest.spyOn(mockRepository, 'find').mockResolvedValueOnce(mockedCustomers);
      const customers = await service.findAll();
      expect(customers.length).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return one customer', async () => {
      jest
        .spyOn(mockRepository, 'findOne')
        .mockResolvedValueOnce(mockedCustomers[1]);
      const customer = await service.findOne(2);
      expect(customer).toBeDefined();
      expect(customer.email).toBe(mockedCustomers[1].email);
    });

    it('should return NotFound exception', async () => {
      const id = 0;
      jest.spyOn(mockRepository, 'findOne').mockImplementation(() => {
        throw new NotFoundException(`Customer with id ${id} does not exist.`);
      });

      await expect(service.findOne(id)).rejects.toEqual(
        new NotFoundException(`Customer with id ${id} does not exist.`),
      );
    });
  });

  describe('create', () => {
    it('should create user succesfully', () => {
      jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(undefined);

      jest
        .spyOn(mockRepository, 'create')
        .mockResolvedValueOnce(mockedCustomers[0] as never);

      jest
        .spyOn(mockRepository, 'save')
        .mockResolvedValueOnce(mockedCustomers[0]);

      const user = service.create({
        email: 'johnyDoe@email.com',
        firstname: 'John',
        lastname: 'Doe',
      });

      expect(user).toBeDefined();
    });

    it('should throw error, because user with that email exists', async () => {
      jest
        .spyOn(mockRepository, 'findOne')
        .mockResolvedValueOnce(mockedCustomers[0]);

      await expect(
        service.create({
          email: 'johnDoe@email.com',
          firstname: 'John',
          lastname: 'Doe',
        }),
      ).rejects.toEqual(
        new BadRequestException(`Customer with this email exists.`),
      );
    });
  });

  describe('update', () => {
    it('should throw error, because user to update was not founded', async () => {
      jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(undefined);

      const id = 0;
      await expect(
        service.update(id, {
          email: 'johnDoe@email.com',
          firstname: 'John',
          lastname: 'Doe',
        }),
      ).rejects.toEqual(
        new NotFoundException(`Customer with id ${id} does not exist.`),
      );
    });

    it('should throw error, because user with this email already exists in database', async () => {
      jest
        .spyOn(mockRepository, 'findOne')
        .mockResolvedValue(mockedCustomers[1]);

      const id = 1;
      await expect(
        service.update(id, {
          email: 'johnDoe@email.com',
          firstname: 'John',
          lastname: 'Doe',
        }),
      ).rejects.toEqual(
        new NotFoundException(`Customer with this email exists.`),
      );
    });

    it('should succesfully update user', async () => {
      jest
        .spyOn(mockRepository, 'findOne')
        .mockResolvedValue(mockedCustomers[0]);

      jest.spyOn(mockRepository, 'save').mockResolvedValue(mockedCustomers[0]);

      const id = 1;
      const customer = await service.update(id, {
        email: 'johnDoe@email.com',
        firstname: 'John',
        lastname: 'Doe',
      });

      expect(customer).toBeDefined();
    });
  });

  describe('delete', () => {
    it('should succesfully delete user', async () => {
      jest
        .spyOn(mockRepository, 'findOne')
        .mockResolvedValueOnce(mockedCustomers[0]);
      jest
        .spyOn(mockRepository, 'remove')
        .mockResolvedValueOnce(mockedCustomers[0]);

      const removedUser = await service.remove(0);
      expect(removedUser).toBeDefined();
    });
    it('should throw error, because user to delete was not founded', async () => {
      jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(undefined);

      const id = 0;
      await expect(service.remove(id)).rejects.toEqual(
        new NotFoundException(`Customer with id ${id} does not exist.`),
      );
    });
  });

  describe('isEmailUsed', () => {
    it('should throw BadRequest exception (user with this email exists)', async () => {
      jest
        .spyOn(mockRepository, 'findOne')
        .mockResolvedValueOnce(mockedCustomers[0]);
      await expect(service.isEmailUsed('johnDoe@email.com')).rejects.toEqual(
        new BadRequestException(`Customer with this email exists.`),
      );
    });
  });
});
