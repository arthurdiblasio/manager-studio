import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { CredentialsDto } from './dtos/credentials.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.authService.signUp(createUserDto);
    return {
      message: 'Cadastro realizado com sucesso',
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signIn(
    @Body() credentiaslsDto: CredentialsDto,
  ): Promise<{ token: string }> {
    return await this.authService.signIn(credentiaslsDto);
  }

  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
