import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserHelper } from '../../helpers/user-helper';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userHelper: UserHelper,
    private readonly prisma: PrismaService,
  ) { }
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req?.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No authorization token provided');
    }

    try {
      const value: any = await jwt.verify(token, process.env.JWT_SECRET);

      const user = await this.prisma.user.findUnique({
        where: {
          id: value.id,
        },
      });

      if (!user) {
        throw new ForbiddenException('Invalid access token');
      }

      console.log({ role: user.role })

      this.userHelper.setUser({
        email: user.email,
        id: user.id,
        role: user.role,
      });

      next();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
