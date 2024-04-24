import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Param,
  ForbiddenException,
  Request,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './services/customers.service';
import { CreateUserDto } from './dtos/create-customer.dto';
import { ReturnUserDto } from './dtos/return-customer.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './enums/user-roles.enum';
import { UpdateUserDto } from './dtos/update-customers.dto';
import { FindUsersQueryDto } from './dtos/find-customers-query.dto';

@Controller('customers')
export class CustomersController {
  constructor(private usersService: UsersService) {}

  @Post('')
  @Roles(UserRole.ADMIN)
  async createAdminUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createAdminUser(createUserDto);
    return {
      user,
      message: 'Administrador cadastrado com sucesso',
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findUserById(@Param('id') id): Promise<ReturnUserDto> {
    const user = await this.usersService.findUserById(id);
    return {
      user,
      message: 'Usuário encontrado',
    };
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findUsers(@Query() query: FindUsersQueryDto) {
    const found = await this.usersService.findUsers(query);
    return {
      found,
      message: 'Usuários encontrados',
    };
  }

  @Patch(':id')
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Request() req,
    @Param('id') id: string,
  ) {
    const { user } = req;
    if (user.role != UserRole.ADMIN && user.id.toString() != id) {
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso',
      );
    } else {
      return this.usersService.updateUser(updateUserDto, id);
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return {
      message: 'Usuário removido com sucesso',
    };
  }
}
