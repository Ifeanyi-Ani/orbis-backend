import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  signup() {
    return this.authService.register();
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
