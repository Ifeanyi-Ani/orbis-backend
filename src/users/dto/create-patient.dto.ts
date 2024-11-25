import { Prisma } from '@prisma/client';
import { UserCreateInputWithoutRelations } from 'types';

type PatientCreateInputWithoutUser = Omit<Prisma.PatientCreateInput, 'user'>;

export interface CreatePatientDto
  extends UserCreateInputWithoutRelations,
    PatientCreateInputWithoutUser {}
