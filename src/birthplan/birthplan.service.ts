import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBirthplanDto } from './dto/create-birthplan.dto';
import { UpdateBirthplanDto } from './dto/update-birthplan.dto';

@Injectable()
export class BirthplanService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createBirthplanDto: CreateBirthplanDto) {
    const nBirthPlan = await this.prisma.birthPlan
      .upsert({
        where: {
          motherId: createBirthplanDto.motherId,
        },
        create: {
          ...createBirthplanDto,
        },

        update: {
          ...createBirthplanDto,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });
    return nBirthPlan;
  }

  async findByFacility(facilityId: string) {
    const birthPlans = await this.prisma.birthPlan
      .findMany({
        where: {
          facilityId,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return birthPlans;
  }

  async getByMotherId(motherId: string) {
    const birthPlan = await this.prisma.birthPlan
      .findUnique({
        where: {
          motherId,
        },

        include: {
          mother: {
            select: {
              f_name: true,
              l_name: true,
            },
          },
        },
      })
      .then((data) => {
        if (!data) {
          return null;
        }
        return data;
      })
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return birthPlan;
  }

  async updateBirthPlan({ id, ...rest }: UpdateBirthplanDto) {
    const updated = await this.prisma.birthPlan
      .update({
        where: {
          id,
        },
        data: {
          ...rest,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return updated;
  }
}
