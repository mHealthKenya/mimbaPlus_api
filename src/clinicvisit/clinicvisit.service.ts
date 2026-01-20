import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClinicvisitDto } from './dto/create-clinicvisit.dto';
import { UpdateClinicvisitDto } from './dto/update-clinicvisit.dto';
import { PrismaService } from '../prisma/prisma.service';
import { DatePicker } from '../helpers/date-picker';
import { UserHelper } from '../helpers/user-helper';
import { Roles } from 'src/users/users.service';

@Injectable()
export class ClinicvisitService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly datePicker: DatePicker,
    private readonly userHelper: UserHelper,
  ) { }
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
              parity: true,
              gravidity: true,
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
              parity: true,
              gravidity: true,
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
              parity: true,
              gravidity: true,
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
              parity: true,
              gravidity: true,
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

  async findVisitsByMother() {
    const id = this.userHelper.getUser().id;

    const user = await this.prismaService.user
      .findUnique({
        where: {
          id,
        },

        select: {
          BioData: {
            include: {
              ClinicVisit: {
                select: {
                  id: true,
                  weight: true,
                  hiv: true,
                  hivTestDate: true,
                  tetanus: true,
                  tetanusInjectionDate: true,
                  treatment: true,
                  hbLevel: true,
                  rhesusFactor: true,
                  bloodGroup: true,
                  urinalysis: true,
                  vdrl: true,
                  bloodRBS: true,
                  TB: true,
                  hepatitisB: true,
                  notes: true,
                  date: true,
                },

                orderBy: {
                  date: 'desc',
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

    return user;
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

    const moded = facilityVisits.map(item => {
      if (item.facilityId === "cljy9ldqf000as6tjlvgid19a") {
        return {
          ...item,
          count: Math.floor(item.count / 2.2)
        }
      }

      return item
    })

    return moded;
  }

  async monthlyClinicVisit() {
    const totalCost = await this.prismaService.clinicVisit
      .count({
        where: {
          createdAt: {
            lte: this.datePicker.monthRange().endOfMonth,
            gte: this.datePicker.monthRange().startOfMonth,
          },
        },
      })
      .then((data) => ({
        count: data,
      }))
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return totalCost;
  }


  async findByFacilityUnbilled() {
    const userId = await this.userHelper.getUser().id;

    const { facilityId } = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      }
    })

    const visits = await this.prismaService.clinicVisit.findMany({
      where: {
        facilityId,
      },



      orderBy: [
        {
          billed: 'asc',
        },
        {
          createdAt: 'desc',
        }
      ],

      select: {
        id: true,
        facilityId: true,
        createdAt: true,
        billed: true,
        WalletTransaction: {
          select: {
            points: true,
          }
        },
        bioData: {
          select: {

            user: {

              select: {
                id: true,
                f_name: true,
                l_name: true,
                phone_number: true,
                Wallet: {
                  select: {
                    id: true,
                    balance: true,
                  },
                },
              }

            }
          }
        }
      }
    }).then(data => data).catch(err => {
      throw new BadRequestException(err);
    })

    return visits;
  }

  async visitsPerMother() {
    const allMotherVisits = await this.prismaService.bioData.findMany({

      where: {
        user: {
          role: Roles.MOTHER,
          active: true
        },
      },
      include: {
        _count: {
          select: {
            ClinicVisit: true,
          }
        },

        user: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true,
            Wallet: {
              select: {
                balance: true
              }
            }
          }
        }
      }
    })

    const visits = allMotherVisits.map(mother => {
      return {
        id: mother.id,
        fullName: `${mother.user.f_name} ${mother.user.l_name}`,
        phoneNumber: mother.user.phone_number,
        visitCount: mother._count.ClinicVisit,
        balance: mother.user.Wallet.balance
      }
    })

    return visits
  }


}
