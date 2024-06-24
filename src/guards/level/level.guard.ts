import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserHelper } from '../../helpers/user-helper';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LevelGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userHelper: UserHelper,
  ) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = {
      SuperAdmin: 5,
      Admin: 4,
      Facility: 3,
      CHV: 2,
      Mother: 1,
    };

    const request = context.switchToHttp().getRequest();
    const data = request?.body;
    const id = data?.id;
    if (!id) {
      return false;
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return false;
    }

    const userRole = this.userHelper.getUser().role;


    return roles[userRole] > roles[user.role];
  }
}
