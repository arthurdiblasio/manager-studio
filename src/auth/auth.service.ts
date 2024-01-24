import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return await this.userService.createAdminUser(createUserDto);
    }
  }
}
