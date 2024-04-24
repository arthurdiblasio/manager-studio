import { BaseQueryParametersDto } from 'src/shared/dto/base-query-parameters.dto';
import { CustomerStatusEnum } from '../enums/customer-status.enum';

export class FindCustomersQueryDto extends BaseQueryParametersDto {
  fullName: string;
  status: CustomerStatusEnum;
}
