import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [],
  controllers: [UsersController, AuthController],
  providers: [UsersService],
})
export class AppModule {}
