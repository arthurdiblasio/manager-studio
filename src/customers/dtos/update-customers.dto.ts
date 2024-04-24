import { IsOptional } from 'class-validator';
import { CustomerStatusEnum } from '../enums/customer-status.enum';
export class UpdateCustomerDto {
  @IsOptional()
  fullName: string;

  @IsOptional()
  email: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  status: CustomerStatusEnum;
}
