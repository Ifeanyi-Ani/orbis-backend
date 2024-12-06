import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaErrorHandler } from 'src/exception/prisma.exception';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  constructor(private readonly database: DatabaseService) {}

  public async createVerificationToken(userId: string) {
    console.log({ userId });
    if (!userId) {
      throw new NotFoundException('userId is missing');
    }
    try {
      const token = uuidv4();
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);

      await this.database.verificationToken.create({
        data: {
          token,
          userId,
          expires,
        },
      });

      return token;
    } catch (error) {
      if (error instanceof BaseExceptionFilter) {
        throw error;
      }
      PrismaErrorHandler.handle(error);
    }
  }

  public async createPasswordSetupToken(userId: string) {
    try {
      const token = uuidv4();
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);

      await this.database.passwordSetupToken.create({
        data: {
          token,
          userId,
          expires,
        },
      });

      return token;
    } catch (error) {
      if (error instanceof BaseExceptionFilter) {
        throw error;
      }
      PrismaErrorHandler.handle(error);
    }
  }

  public async validateToken(
    token: string,
    type: 'verification' | 'passwordSetup',
  ) {
    try {
      const tokenModel =
        type === 'verification'
          ? await this.database.verificationToken.findUnique({
              where: { token },
              include: { user: true },
            })
          : await this.database.passwordSetupToken.findUnique({
              where: { token },
              include: { user: true },
            });

      if (!tokenModel) {
        throw new NotFoundException('token not found');
      }

      if (tokenModel.expires < new Date()) {
        throw new BadRequestException('expired token');
      }

      if (tokenModel.used) {
        throw new ConflictException('token already used');
      }

      return tokenModel;
    } catch (error) {
      if (error instanceof BaseExceptionFilter) {
        throw error;
      }
      PrismaErrorHandler.handle(error);
    }
  }
}
