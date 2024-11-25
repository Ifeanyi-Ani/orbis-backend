import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Protect } from 'src/auth/guard/protect.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(Protect, RolesGuard)
  @Roles(Role.RECEPTIONIST, Role.ADMIN)
  @HttpCode(201)
  @Post('patients')
  createPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.usersService.createPatient(createPatientDto);
  }

  @Post('admin')
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.usersService.createAdmin(createAdminDto);
  }
}
