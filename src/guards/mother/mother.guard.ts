import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Roles } from '../../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserHelper } from '../../helpers/user-helper';

@Injectable()
export class MotherPrivateDataGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userHelper: UserHelper,
  ) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const editorId = this.userHelper.getUser().id;

    switch (request.method) {
      case 'GET':
        const facilityAdminD = this.prisma.user.findUnique({
          where: {
            id: editorId,
          },
        });



        const motherD = this.prisma.user.findUnique({
          where: {
            id: request?.query?.motherId,
          },
        });

        const [facilityAdminDetails, motherDetails] = await Promise.all([
          facilityAdminD,
          motherD,
        ]);

        if (!facilityAdminDetails || !motherDetails) {
          return false;
        }

        const allowedRoles = [
          Roles.CHV, Roles.FACILITY
        ]

        if (
          !allowedRoles.includes(facilityAdminDetails.role as Roles) ||
          !facilityAdminDetails.facilityId
        ) {
          console.log("here")
          return false;
        }

        console.log({
          owner: facilityAdminDetails.id,
          createdBy: motherDetails.createdById,
          editorId
        })

        return facilityAdminDetails.facilityId === motherDetails.facilityId || facilityAdminDetails.id === motherDetails.createdById

      case 'POST':
      case 'PATCH':
      case 'PUT':
      case 'DELETE':
        const data = request?.body;
        const userId = data?.userId;
        const mother = this.prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        const facility = this.prisma.user.findUnique({
          where: {
            id: editorId,
          },
        });

        const [isMother, facilityAdmin] = await Promise.all([mother, facility]);

        return (
          isMother?.role === Roles.MOTHER &&
          facilityAdmin?.role === Roles.FACILITY &&
          isMother?.facilityId === facilityAdmin.facilityId
        );

      default:
        return false;
    }
  }
}
