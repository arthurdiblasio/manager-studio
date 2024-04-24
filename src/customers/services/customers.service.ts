import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customer.entity';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { FindCustomersQueryDto } from '../dtos/find-customers-query.dto';
import { UpdateCustomerDto } from '../dtos/update-customers.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const { email, fullName, cpf, phone } = createCustomerDto;

    const customer = new Customer();
    customer.email = email;
    customer.fullName = fullName;
    customer.cpf = cpf;
    customer.phone = phone;
    try {
      await customer.save();
      return customer;
    } catch (error) {
      if (error.code?.toString() === '23505') {
        throw new ConflictException('Email is already being used');
      } else {
        throw new InternalServerErrorException('Error to save Customer');
      }
    }
  }

  async findCustomerById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new NotFoundException('Usuário não encontrado');

    return customer;
  }

  async updateCustomer(
    updateCustomerDto: UpdateCustomerDto,
    id: string,
  ): Promise<Customer> {
    const customer = await this.findCustomerById(id);
    const { fullName, status, email, phone } = updateCustomerDto;
    customer.email = email || customer.email;
    customer.fullName = fullName || customer.fullName;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;
    customer.status = status || customer.status;
    try {
      await customer.save();
      return customer;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar os dados no banco de dados',
      );
    }
  }

  async deleteCustomer(id: string) {
    const result = await this.customerRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado um usuário com o ID informado',
      );
    }
  }

  async findCustomers(
    queryDto: FindCustomersQueryDto,
  ): Promise<{ customers: Customer[]; total: number }> {
    queryDto.status = queryDto.status === undefined ? true : queryDto.status;
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

    const { email, name, status, role } = queryDto;
    const query = Customer.createQueryBuilder('customer');
    query.where('customer.status = :status', { status });

    if (email) {
      query.andWhere('customer.email ILIKE :email', { email: `%${email}%` });
    }

    if (name) {
      query.andWhere('customer.name ILIKE :name', { name: `%${name}%` });
    }

    if (role) {
      query.andWhere('customer.role = :role', { role });
    }
    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select([
      'customer.name',
      'customer.email',
      'customer.role',
      'customer.status',
    ]);

    const [customers, total] = await query.getManyAndCount();

    return { customers, total };
  }
}
