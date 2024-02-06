import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { CredentialsDto } from './dtos/credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return await this.userService.createAdminUser(createUserDto);
    }
  }

  async signIn(credentialsDto: CredentialsDto) {
    const user = await this.userService.checkCredentials(credentialsDto);

    if (user === null) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const jwtPayload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(jwtPayload);

    return { token };
  }
}
