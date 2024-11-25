import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { DatabaseService } from 'src/database/database.service';
import { Role } from '@prisma/client';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async createAdmin(createAdminDto: Partial<CreateAdminDto>) {
    const { role, firstName, lastName, password, email, ...additionalDetails } =
      createAdminDto;

    if (!(role === Role.ADMIN)) {
      throw new BadRequestException(
        'Please use the right route for creating the user',
      );
    }

    const existingUser = await this.database.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return this.database.$transaction(async (db) => {
      const user = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role,
        },
      });

      const admin = await db.admin.create({
        data: {
          ...additionalDetails,
          userId: user.id,
        },
      });

      user.password = undefined;

      return { ...user, admin };
    });
  }

  async createPatient(createPatientDto: CreatePatientDto) {
    const { medicalHistory, insuranceInfo, dob, ...userData } =
      createPatientDto;

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    return this.database.$transaction(async (db) => {
      const user = await db.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          role: Role.PATIENT,
        },
      });

      const patient = await db.patient.create({
        data: {
          userId: user.id,
          dob,
          medicalHistory,
          insuranceInfo,
        },
      });

      user.password = undefined;

      return { ...user, patient };
    });
  }
}
