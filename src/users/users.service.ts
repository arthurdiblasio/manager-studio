import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from './enums/user-roles.enum';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CredentialsDto } from 'src/auth/dtos/credentials.dto';

@Injectable()
export class UsersService {
  constructor() {}

  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      const { email, name, password } = createUserDto;

      const user = new User();
      user.email = email;
      user.name = name;
      user.role = UserRole.ADMIN;
      user.status = true;
      user.confirmationToken = crypto.randomBytes(32).toString('hex');
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(password, user.salt);
      try {
        await user.save();
        delete user.password;
        delete user.salt;
        return user;
      } catch (error) {
        if (error.code.toString() === '23505') {
          throw new ConflictException('Endereço de email já está em uso');
        } else {
          throw new InternalServerErrorException(
            'Erro ao salvar o usuário no banco de dados',
          );
        }
      }
    }
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
    const { email, password } = credentialsDto;
    const user = await User.findOne({ where: { email, status: true } });

    if (user && (await user.checkPassword(password))) {
      return user;
    } else {
      return null;
    }
  }
}
