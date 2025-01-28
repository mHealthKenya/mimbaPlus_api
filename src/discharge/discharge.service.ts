import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AdmissionStatus } from '@prisma/client';
import { UserHelper } from 'src/helpers/user-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDischargeDto } from './dto/create-discharge.dto';
import { GetDischargeRequestsDto } from './dto/get-discharge-requests';
import { DischargeStatus, UpdateDischargeRequestDto } from './dto/update-discharge-request.dto';
import { GetDischargeRequestDto } from './dto/get-discharge-request';

@Injectable()
export class DischargeService {

  constructor(private readonly prisma: PrismaService, private readonly userHelper: UserHelper) { }

  async create(createDischargeDto: CreateDischargeDto, files: string[]) {


    const userId = await this.userHelper.getUser().id;

    const requestDischarge = this.prisma.dischargeRequest.create({
      data: {
        userId,
        admissionId: createDischargeDto.admissionId,
        files
      }
    })

    const updateAdmission = this.prisma.admission.update({
      where: {
        id: createDischargeDto.admissionId
      },
      data: {
        status: AdmissionStatus.Processing
      }
    })

    const complete = await this.prisma.$transaction([requestDischarge, updateAdmission]).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })

    return complete;
  }


  async updateDischarge(data: UpdateDischargeRequestDto) {

    const userId = await this.userHelper.getUser().id;




    const discharge = await this.prisma.dischargeRequest.findUnique({
      where: {
        id: data.id,
      },

      include: {
        admission: {
          include: {
            user: {
              include: {
                Wallet: true
              }
            }
          }
        }
      }
    }).then(data => {
      if (!data) throw new NotFoundException('Discharge request not found')

      return data
    }).catch(err => {
      throw new BadRequestException(err)
    })

    if (discharge.admission.user.Wallet.balance < data.walletAmount) throw new BadRequestException('Insufficient wallet balance')


    if (discharge.status !== DischargeStatus.PENDING) throw new BadRequestException('Discharge request has been processed')

    if (data.status === DischargeStatus.REJECTED) {
      const dischargeRequest = this.prisma.dischargeRequest.update({
        where: {
          id: data.id
        },
        data: {
          status: data.status,
          processedById: userId

        }
      })

      const updateAdmission = this.prisma.admission.update({
        where: {
          id: discharge.admissionId
        },
        data: {
          status: AdmissionStatus.Rejected
        }
      })

      const transaction = await this.prisma.$transaction([dischargeRequest, updateAdmission]).then(data => data).catch(err => {
        throw new BadRequestException(err)
      })

      return transaction;
    }


    if (!discharge.admission.user.hasWallet) {
      throw new BadRequestException('User does not have a wallet')
    }


    const createDischarge = this.prisma.discharge.create({
      data: {
        walletAmount: data.walletAmount,
        settleAmount: data.settleAmount,
        dischargeRequestId: data.id,
        userId,
        WalletTransaction: {
          create: {
            approvedById: userId,
            points: data.walletAmount,
            userId: discharge.admission.userId,
            previousPoints: discharge.admission.user.Wallet.balance,
            balance: discharge.admission.user.Wallet.balance - data.walletAmount,
            createdById: userId,
            facilityId: discharge.admission.facilityId

          }
        }
      }
    })

    const updateDischargeRequest = this.prisma.dischargeRequest.update({
      where: {
        id: data.id
      },
      data: {
        status: data.status,
        processedById: userId
      }
    })


    const updateWalletBalance = this.prisma.wallet.update({
      where: {
        userId: discharge.admission.userId
      },
      data: {
        balance: {
          decrement: data.walletAmount
        }
      }
    })

    const updateFacilityBalance = this.prisma.facilityWallet.update({
      where: {
        facilityId: discharge.admission.facilityId
      },
      data: {
        balance: {
          increment: data.walletAmount
        }
      }
    })

    const updateAdmission = this.prisma.admission.update({
      where: {
        id: discharge.admissionId
      },
      data: {
        status: AdmissionStatus.Discharged
      }
    })


    const transaction = await this.prisma.$transaction([createDischarge, updateAdmission, updateDischargeRequest, updateWalletBalance, updateFacilityBalance]).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })

    return transaction;

  }


  async findDischargeRequests({ status }: GetDischargeRequestsDto) {
    const requests = await this.prisma.dischargeRequest.findMany({
      where: {
        status
      },

      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        admission: {
          include: {
            user: {
              select: {
                f_name: true,
                l_name: true,
                phone_number: true
              }
            }
          }
        },

        requestedBy: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true
          }
        },

        processedBy: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true
          }
        }


      }
    }).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })

    return requests;
  }

  async getDischargeRequest({ id }: GetDischargeRequestDto) {
    const request = await this.prisma.dischargeRequest.findUnique({
      where: {
        id
      },
      include: {
        admission: {
          include: {
            user: {
              select: {
                f_name: true,
                l_name: true,
                phone_number: true
              }
            }
          }
        },

        requestedBy: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true
          }
        },

        processedBy: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true
          }
        }
      }
    }).then(data => {
      if (!data) throw new NotFoundException('Discharge request not found')

      return data
    }).catch(err => {
      throw new BadRequestException(err)
    })

    return request;
  }

}
