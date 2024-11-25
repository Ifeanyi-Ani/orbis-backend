import { Prisma } from '@prisma/client';
import { UserCreateInputWithoutRelations } from 'types';

type CreateAdminInputWithoutUser = Omit<Prisma.AdminCreateInput, 'user'>;

export interface CreateAdminDto
  extends UserCreateInputWithoutRelations,
    CreateAdminInputWithoutUser {}
