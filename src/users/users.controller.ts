import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Protect } from 'src/auth/guard/protect.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(Protect, RolesGuard)
  }

  @Post('admin')
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.usersService.createAdmin(createAdminDto);
  }
}
