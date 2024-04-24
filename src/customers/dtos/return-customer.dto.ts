import { Customer } from '../customer.entity';

export class ReturnCustomerDto {
  customer: Customer;
  message: string;
}
