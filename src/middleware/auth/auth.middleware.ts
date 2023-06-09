import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserHelper } from '../../helpers/user-helper';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userHelper: UserHelper) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req?.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No authorization token provided');
    }

    try {
      const user: any = await jwt.verify(token, process.env.JWT_SECRET);

      this.userHelper.setUser(user);

      next();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
