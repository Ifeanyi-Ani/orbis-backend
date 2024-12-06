import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
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

  @Post('patients')
  @UseGuards(Protect, RolesGuard)
  @Roles(Role.RECEPTIONIST, Role.ADMIN)
  @HttpCode(201)
  createPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.usersService.createPatient(createPatientDto);
  }

  @Post('admin')
  @HttpCode(201)
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.usersService.createAdmin(createAdminDto);
  }

  @Post('verify-email')
  public async verifyEmail(@Body('token') token: string) {
    return this.usersService.verifyEmail(token);
  }

  @Get('/patients')
  getAllPatient() {
    return this.usersService.findAllPatients();
  }
}
