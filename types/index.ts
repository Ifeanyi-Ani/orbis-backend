import { Prisma } from '@prisma/client';

export type UserCreateInputWithoutRelations = Omit<
  Prisma.UserCreateInput,
  'patient' | 'doctor' | 'nurse' | 'admin' | 'receptionist'
>;

export enum Role {
  PATIENT = 'PATIENT',
  NURSE = 'NURSE',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
}
