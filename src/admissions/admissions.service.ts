import { BadRequestException, Injectable } from '@nestjs/common';
import { UserHelper } from 'src/helpers/user-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { GetAdmissionDto } from './dto/get-admission.dto';
import { GetFacilityAdmissionsDto } from './dto/facility-admissions';

export enum AdmissionStatus {
  ADMITTED = 'Admitted',
  DISCHARGED = 'Discharged'
}

@Injectable()
export class AdmissionsService {

  constructor(private readonly userHelper: UserHelper, private readonly prisma: PrismaService) { }


  async create(createAdmissionDto: CreateAdmissionDto) {


    const { userId } = createAdmissionDto


    const admissions = await this.prisma.admission.findMany({
      where: {
        userId,
        status: AdmissionStatus.ADMITTED
      }
    }).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })

    if (admissions.length > 0) {
      throw new BadRequestException('User is already admitted')
    }



    const admittedById = this.userHelper.getUser().id;

    const admission = await this.prisma.admission.create({
      data: {
        admittedById,
        ...createAdmissionDto
      }
    }).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })

    return admission;
  }

  async findAll() {
    const admissions = await this.prisma.admission.findMany({
      include: {
        admittedBy: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true,
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
    }).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })
    return admissions;
  }



  async findOne({ id }: GetAdmissionDto) {
    const admission = await this.prisma.admission.findUnique({
      where: {
        id
      },
      include: {
        admittedBy: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true,
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
    }).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })

    return admission;
  }


  async facilityAdmissions({ status }: GetFacilityAdmissionsDto) {

    const userId = await this.userHelper.getUser().id;

    const facility = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        facilityId: true
      }
    }).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })

    const facilityId = facility.facilityId;


    const admissions = await this.prisma.admission.findMany({
      where: {
        facilityId,
        status
      },
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        admittedBy: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true,
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
    }).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })

    return admissions;
  }


  async allAdmissions({ status }: GetFacilityAdmissionsDto) {
    const admissions = await this.prisma.admission.findMany({
      where: {
        status
      },
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        admittedBy: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true,
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
    }).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })

    return admissions;

  }
}
