import { Module } from '@nestjs/common';
import { TokenService } from './tokens.service';

@Module({
  controllers: [],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
