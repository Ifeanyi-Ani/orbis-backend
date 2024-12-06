import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TokenModule } from 'src/tokens/tokens.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [AuthModule, TokenModule, MailModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
