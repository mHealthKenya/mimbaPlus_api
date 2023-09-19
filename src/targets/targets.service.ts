import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTargetDto } from './dto/update-target.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TargetsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    const targets = await this.prisma.cHVTargets
      .findMany({
        include: {
          chv: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
              Facility: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return targets;
  }

  async findOne(id: string) {
    const chv = await this.prisma.cHVTargets
      .findUnique({
        where: {
          id,
        },

        include: {
          chv: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
              Facility: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })
      .then((data) => {
        if (!data) {
          throw new NotFoundException('invalid target Id');
        }
        return data;
      })
      .catch((err) => {
        throw new BadRequestException(err);
      });
    return chv;
  }

  async update({ id, setTarget }: UpdateTargetDto) {
    const update = await this.prisma.cHVTargets
      .update({
        where: {
          id,
        },
        data: {
          setTarget: +setTarget,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });
    return update;
  }
}
