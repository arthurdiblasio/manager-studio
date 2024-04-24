import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @MaxLength(200)
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MaxLength(11)
  @MinLength(11)
  phone: string;

  @IsNotEmpty()
  @MaxLength(11)
  @MinLength(11)
  cpf: string;
}
