import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class PrismaErrorHandler {
  static handle(error: Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        // check unique constraint validation
        case 'P2002': {
          const field = (error.meta?.target as string)[0];
          throw new HttpException(
            {
              message: `A record with this ${field} already exists`,
              code: 'UNIQUE_CONSTRAINT_VIOLATION',
              detials: { field },
            },
            HttpStatus.CONFLICT,
          );
        }

        // check code for not found
        case 'P2025':
          throw new HttpException(
            {
              message: 'Record not found.',
              code: 'RECORD_NOT_FOUND',
              details: error.meta,
            },
            HttpStatus.NOT_FOUND,
          );

        // check code for foreign key constraint
        case 'P2003': {
          const field = error.meta.field_name as string;
          throw new HttpException(
            {
              message: `Related ${field} does not exists`,
              code: 'FOREIGN_KEY_CONSTRAINT_FAILED',
              detials: { field },
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        // check code for transaction failed
        case 'P2034':
          throw new HttpException(
            {
              message: 'Transaction failed due to concurrent modification.',
              code: 'TRANSACTION_FAILED',
            },
            HttpStatus.CONFLICT,
          );

        // check code for database timeout
        case 'P2024':
          throw new HttpException(
            {
              message: 'Database operation timed out.',
              code: 'OPERATION_TIMEOUT',
            },
            HttpStatus.GATEWAY_TIMEOUT,
          );

        // check code for invalid data
        case 'P2007':
          throw new HttpException(
            {
              message: 'Validation failed: invalid data provided',
              code: 'INVALID_DATA',
            },
            HttpStatus.BAD_REQUEST,
          );
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new HttpException(
        {
          message: 'Validation error: Please check your input',
          code: 'VALIDATION_ERROR',
          detials: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // otherwise return the error that was throwned or catched
    throw error;
  }
}
