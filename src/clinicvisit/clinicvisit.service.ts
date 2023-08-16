import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClinicvisitDto } from './dto/create-clinicvisit.dto';
import { UpdateClinicvisitDto } from './dto/update-clinicvisit.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClinicvisitService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createClinicvisitDto: CreateClinicvisitDto) {
    const newVisit = await this.prismaService.clinicVisit
      .create({
        data: {
          ...createClinicvisitDto,
          hbLevel: +createClinicvisitDto.hbLevel,
          weight: +createClinicvisitDto.weight,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return newVisit;
  }

  async findAll() {
    const visits = await this.prismaService.clinicVisit
      .findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });
    return visits;
  }

  async findVisitsByFacility(facilityId: string) {
    const visits = await this.prismaService.clinicVisit
      .findMany({
        where: {
          facilityId,
        },

        orderBy: {
          createdAt: 'desc',
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return visits;
  }

  async update(data: UpdateClinicvisitDto) {
    const newData = {
      ...data,
      weight: +data.weight || undefined,
      hbLevel: +data.hbLevel || undefined,
    };
    const updated = await this.prismaService.clinicVisit
      .update({
        where: {
          id: data.id,
        },

        data: {
          ...newData,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });
    return updated;
  }
}
