import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserHelper } from '../../helpers/user-helper';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  constructor(private readonly user: UserHelper) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const added = req?.headers?.authorization;

    if (!!added) {
      const refreshToken = req?.headers?.authorization?.split(' ')[1];

      try {
        const valid: any = await jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH,
        );

        this.user.setUser({
          id: valid.id,
          role: valid.role,
          email: valid.email,
        });

        next();
      } catch (error) {
        this.user.setUser(undefined);
        next();
      }
    } else {
      this.user.setUser(undefined);
      next();
    }
  }
}
