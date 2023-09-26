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
          date: new Date(createClinicvisitDto.date),
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return newVisit;
  }

  async findLatest(bioDataId: string) {
    const result = await this.prismaService.clinicVisit
      .findMany({
        where: {
          bioDataId,
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

          bioData: {
            select: {
              user: {
                select: {
                  f_name: true,
                  l_name: true,
                  phone_number: true,
                },
              },
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
      })
      .then((data) => {
        if (data.length < 1) {
          return {};
        }

        return data[0];
      })
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

          bioData: {
            select: {
              user: {
                select: {
                  f_name: true,
                  l_name: true,
                  phone_number: true,
                },
              },
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

          bioData: {
            select: {
              user: {
                select: {
                  f_name: true,
                  l_name: true,
                  phone_number: true,
                },
              },
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

  async findVisitsByBioData(bioDataId: string) {
    const visits = await this.prismaService.clinicVisit
      .findMany({
        where: {
          bioDataId,
        },

        include: {
          facility: {
            select: {
              name: true,
            },
          },

          bioData: {
            select: {
              user: {
                select: {
                  f_name: true,
                  l_name: true,
                  phone_number: true,
                },
              },
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

  async countVisits() {
    const count = await this.prismaService.clinicVisit
      .count()
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return {
      count,
    };
  }

  async visitByFacility() {
    const val = await this.prismaService.clinicVisit.groupBy({
      by: ['facilityId'],

      _count: {
        facilityId: true,
      },
    });

    const facilityNames = await this.prismaService.facility.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const facilityVisits = facilityNames.map((facility) => ({
      facilityId: facility.id,
      count:
        val.find((item) => item.facilityId === facility.id)?._count
          ?.facilityId || 0,
      facilityName: facility.name,
    }));

    return facilityVisits;
  }
}
