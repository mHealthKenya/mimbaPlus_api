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
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return newVisit;
  }

  async findLatest(motherId: string) {
    const result = await this.prismaService.clinicVisit
      .findMany({
        where: {
          motherId,
        },

        orderBy: {
          updatedAt: 'desc',
        },

        take: 1,

        include: {
          facility: {
            select: {
              name: true,
            },
          },

          mother: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
              BioData: {
                select: {
                  height: true,
                  weight: true,
                  active: true,
                  age: true,
                  last_monthly_period: true,
                  expected_delivery_date: true,
                  pregnancy_period: true,
                  last_clinic_visit: true,
                  previous_pregnancies: true,
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

    return result;
  }

  async findAll() {
    const visits = await this.prismaService.clinicVisit
      .findMany({
        orderBy: {
          createdAt: 'desc',
        },

        include: {
          facility: {
            select: {
              name: true,
            },
          },

          mother: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
              BioData: {
                select: {
                  height: true,
                  weight: true,
                  active: true,
                  age: true,
                  last_monthly_period: true,
                  expected_delivery_date: true,
                  pregnancy_period: true,
                  last_clinic_visit: true,
                  previous_pregnancies: true,
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
    return visits;
  }

  async findVisitsByFacility(facilityId: string) {
    const visits = await this.prismaService.clinicVisit
      .findMany({
        where: {
          facilityId,
        },

        include: {
          facility: {
            select: {
              name: true,
            },
          },

          mother: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
              BioData: {
                select: {
                  height: true,
                  weight: true,
                  active: true,
                  age: true,
                  last_monthly_period: true,
                  expected_delivery_date: true,
                  pregnancy_period: true,
                  last_clinic_visit: true,
                  previous_pregnancies: true,
                },
              },
            },
          },
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
