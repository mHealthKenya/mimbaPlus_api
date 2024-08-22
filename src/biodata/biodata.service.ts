import { BadRequestException, Injectable } from '@nestjs/common';
import { UserHelper } from '../helpers/user-helper';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBiodatumDto } from './dto/create-biodatum.dto';
import { UpdateBiodatumDto } from './dto/update-biodatum.dto';

@Injectable()
export class BiodataService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userHelper: UserHelper,
  ) { }
  async create(createBiodatumDto: CreateBiodatumDto) {
    const newBiodata = await this.prisma.bioData
      .upsert({
        where: {
          userId: createBiodatumDto.userId,
        },
        update: {
          ...createBiodatumDto,
          height: +createBiodatumDto.height,
          weight: +createBiodatumDto.weight,
          age: +createBiodatumDto.age,
          last_monthly_period: new Date(createBiodatumDto.last_monthly_period),
          expected_delivery_date: new Date(
            createBiodatumDto.expected_delivery_date,
          ),
          pregnancy_period: +createBiodatumDto.pregnancy_period,
          last_clinic_visit: new Date(createBiodatumDto.last_clinic_visit),
          gravidity: +createBiodatumDto.gravidity || 0,
          parity: createBiodatumDto.parity,
          createdById: this.userHelper.getUser().id,
          updatedById: this.userHelper.getUser().id,
        },
        create: {
          ...createBiodatumDto,
          height: +createBiodatumDto.height,
          weight: +createBiodatumDto.weight,
          age: +createBiodatumDto.age,
          last_monthly_period: new Date(createBiodatumDto.last_monthly_period),
          expected_delivery_date: new Date(
            createBiodatumDto.expected_delivery_date,
          ),
          pregnancy_period: +createBiodatumDto.pregnancy_period,
          last_clinic_visit: new Date(createBiodatumDto.last_clinic_visit),
          gravidity: +createBiodatumDto.gravidity || 0,
          parity: createBiodatumDto.parity,
          createdById: this.userHelper.getUser().id,
          updatedById: this.userHelper.getUser().id,
        },
      })

      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return newBiodata;
  }

  async getById(id: string) {
    const bio = await this.prisma.bioData
      .findUnique({
        where: {
          id,
        },

        include: {
          user: true,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return bio;
  }

  async getByMotherId(userId: string) {
    const biodatum = await this.prisma.bioData
      .findUnique({
        where: {
          userId,
        },

        include: {
          user: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
              national_id: true,
            },
          },
        },
      })
      .then((data) => {
        if (!data) {
          return {
            message: 'Bio Data Not Added',
          };
        }

        return data;
      })
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return biodatum;
  }

  async updateBiodatum(data: UpdateBiodatumDto) {
    const { userId, ...rest } = data;
    const updatedDto = await this.prisma.bioData
      .update({
        where: {
          userId,
        },

        data: {
          ...rest,
          height: data.height && +data.height,
          weight: data.weight && +data.weight,
          age: data.age && +data.age,
          last_monthly_period:
            data.last_monthly_period && new Date(data.last_monthly_period),
          expected_delivery_date:
            data.expected_delivery_date &&
            new Date(data.expected_delivery_date),
          pregnancy_period: data.pregnancy_period && +data.pregnancy_period,
          last_clinic_visit:
            data.last_clinic_visit && new Date(data.last_clinic_visit),
          gravidity: data?.gravidity || 0,
          parity: data.parity,
          createdById: this.userHelper.getUser().id,
          updatedById: this.userHelper.getUser().id,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return updatedDto;
  }

  async bioDataByFacility(facilityId: string) {
    const bio = await this.prisma.bioData.findMany({
      where: {
        facilityId,
      },

      include: {
        user: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true,
            Wallet: {
              select: {
                balance: true,
              },
            }
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return bio;
  }
}
