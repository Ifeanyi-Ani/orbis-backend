import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  signup(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.authService.register(createUserDto);
  }

  @HttpCode(200)
  @Post('login')
  signin(
    @Body() { email, password }: { email: string; password: string },
    @Res() res: Response,
  ) {
    return this.authService.login(email, password, res);
  }
}
