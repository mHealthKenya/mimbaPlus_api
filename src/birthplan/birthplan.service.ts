import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBirthplanDto } from './dto/create-birthplan.dto';

@Injectable()
export class BirthplanService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createBirthplanDto: CreateBirthplanDto) {
    const nBirthPlan = await this.prisma.birthPlan
      .create({
        data: {
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
}
