import { Injectable } from '@nestjs/common';

import { DatePicker } from '../helpers/date-picker';
import { PrismaService } from '../prisma/prisma.service';
import { UserHelper } from '../helpers/user-helper';
import { Roles } from '../users/users.service';

@Injectable()
export class StatsService {
  constructor(
    private readonly datePicker: DatePicker,
    private readonly prisma: PrismaService,
    private readonly userHelper: UserHelper,
  ) { }

  async visitsCount() {
    const id = this.userHelper.getUser().id;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const clinicalVisits = await this.prisma.clinicVisit.count({
      where: {
        facilityId: user?.facilityId,
      },
    });

    return {
      totalVisits: clinicalVisits,
    };
  }

  async monthlyVisitsCount() {
    const id = this.userHelper.getUser().id;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const clinicalVisits = await this.prisma.clinicVisit.count({
      where: {
        facilityId: user?.facilityId,
        date: {
          lte: this.datePicker.monthRange().endOfMonth,
          gte: this.datePicker.monthRange().startOfMonth,
        },
      },
    });

    return {
      monthlyVisits: clinicalVisits,
    };
  }

  async totalMothers() {
    const id = this.userHelper.getUser().id;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const mothers = await this.prisma.user.count({
      where: {
        facilityId: user.facilityId,
        role: Roles.MOTHER,
      },
    });

    return {
      mothersInFacility: mothers,
    };
  }

  async mothersRegisteredMonthly() {
    const id = this.userHelper.getUser().id;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const mothers = await this.prisma.user.count({
      where: {
        facilityId: user.facilityId,
        role: Roles.MOTHER,
        createdAt: {
          lte: this.datePicker.monthRange().endOfMonth,
          gte: this.datePicker.monthRange().startOfMonth,
        },
      },
    });

    return {
      mothersRegisteredThisMonth: mothers,
    };
  }

  async totalCHVs() {
    const id = this.userHelper.getUser().id;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const mothers = await this.prisma.user.count({
      where: {
        facilityId: user.facilityId,
        role: Roles.CHV,
      },
    });

    return {
      chvsInFacility: mothers,
    };
  }

  async scheduleDistribution() {
    const id = this.userHelper.getUser().id;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const schedules = await this.prisma.schedule.groupBy({
      by: ['status'],
      where: {
        facilityId: user.facilityId,
      },

      _count: {
        status: true,
      },
    });

    return {
      schedules,
    };
  }

  async chvMothersRegistered() {
    const id = this.userHelper.getUser().id;

    const mothers = await this.prisma.user.count({
      where: {
        createdById: id,
        role: Roles.MOTHER,
      },
    });

    return {
      totalMothersRegistered: mothers,
    };
  }

  async chvFollowUpDist() {
    const id = this.userHelper.getUser().id;

    const followups = await this.prisma.followUp.groupBy({
      by: ['status'],
      where: {
        chvId: id,
      },

      _count: {
        status: true,
      },
    });

    return {
      followups,
    };
  }

  async totalMothersCHV() {
    const id = this.userHelper.getUser().id;

    const mothers = await this.prisma.user.count({
      where: {
        createdById: id,
        role: Roles.MOTHER,
      },
    });

    return {
      chVMothers: mothers,
    };
  }

  async chvMothersRegisteredMonthly() {
    const id = this.userHelper.getUser().id;

    const mothers = await this.prisma.user.count({
      where: {
        createdById: id,
        role: Roles.MOTHER,
        createdAt: {
          lte: this.datePicker.monthRange().endOfMonth,
          gte: this.datePicker.monthRange().startOfMonth,
        },
      },
    });

    return {
      mothersRegisteredThisMonth: mothers,
    };
  }

  async totalEnquiries() {
    const senderId = this.userHelper.getUser().id;

    const enquiries = await this.prisma.enquiries.count({
      where: {
        senderId,
      },
    });

    return {
      totalEnquiries: enquiries,
    };
  }

  async totalMonthlyEnquiries() {
    const senderId = this.userHelper.getUser().id;
    const enquiries = await this.prisma.enquiries.count({
      where: {
        senderId,
        createdAt: {
          lte: this.datePicker.monthRange().endOfMonth,
          gte: this.datePicker.monthRange().startOfMonth,
        },
      },
    });

    return {
      enquiriesThisMonth: enquiries,
    };
  }


  async mothersWith7kBAl() {
    const users = await this.prisma.wallet.findMany({
      where: {
        balance: 7000
      },

      include: {
        user: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true,
            BioData: {
              select: {
                _count: {
                  select: {
                    ClinicVisit: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return {
      count: users.length,
      users
    }

  }
}
