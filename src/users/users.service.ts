import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { DatabaseService } from 'src/database/database.service';
import { Role } from '@prisma/client';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaErrorHandler } from 'src/exception/prisma.exception';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    try {
      const {
        role,
        firstName,
        lastName,
        password,
        email,
        dob,
        contactNumber,
        ...additionalDetails
      } = createAdminDto;

      if (!(role === Role.ADMIN)) {
        throw new BadRequestException(
          'Please use the right route for creating the user',
        );
      }

      // encrypt password
      const hashedPassword = await bcrypt.hash(password, 12);

      await this.database.$transaction(async (db) => {
        const user = await db.user.create({
          data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
            dob,
            contactNumber,
          },
        });

        const admin = await db.admin.create({
          data: {
            userId: user.id,
            ...additionalDetails,
          },
        });

        user.password = undefined;

        return { ...user, admin };
      });
    } catch (error) {
      if (error instanceof BaseExceptionFilter) {
        throw error;
      }

      console.log(error?.meta?.target);
      PrismaErrorHandler.handle(error);
    }
  }

  async createPatient(createPatientDto: CreatePatientDto) {
    try {
      const {
        firstName,
        lastName,
        password,
        email,
        dob,
        contactNumber,
        ...additionalDetails
      } = createPatientDto;

      const hashedPassword = await bcrypt.hash(password, 12);

      await this.database.$transaction(async (db) => {
        const user = await db.user.create({
          data: {
            firstName,
            lastName,
            email,
            contactNumber,
            dob,
            password: hashedPassword,
            role: Role.PATIENT,
          },
        });

        const patient = await db.patient.create({
          data: {
            userId: user.id,
            ...additionalDetails,
          },
        });

        user.password = undefined;

        return { ...user, patient };
      });
    } catch (error) {
      if (error instanceof BaseExceptionFilter) {
        throw error;
      }
      console.log({ error });
      PrismaErrorHandler.handle(error);
    }
  }

  async findAllPatients(includeDetails = true) {
    try {
      const patients = await this.database.user.findMany({
        where: { role: Role.PATIENT },
        include: { patient: includeDetails },
      });
      return { patients };
    } catch (error) {
      if (error instanceof BaseExceptionFilter) {
        throw error;
      }
      PrismaErrorHandler.handle(error);
    }
  }

  async findOnePatients(id: string) {
    try {
      return this.database.user.findUnique({
        where: { id },
        include: { patient: true },
      });
    } catch (error) {
      if (error instanceof BaseExceptionFilter) {
        throw error;
      }
      PrismaErrorHandler.handle(error);
    }
  }
}
