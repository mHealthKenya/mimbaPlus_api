import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { UserHelper } from 'src/helpers/user-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendsmsService } from 'src/sendsms/sendsms.service';
import { codegen } from '../utils/codegen';
import { ApproveTransactionDto } from './dto/approve-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateWalletBaseDto } from './dto/create-walletbase.dto';
import { FindWalletDto } from './dto/find-wallet.dto';
import { RequestCodeDto } from './dto/request-code.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { CodeRequestedEvent } from './events/code-requested.event';
import { TransactionCompletedEvent } from './events/tranasction-completed.dto';

@Injectable()
export class WalletService {

  constructor(private readonly prisma: PrismaService, private readonly userHelper: UserHelper, private readonly eventEmitter: EventEmitter2, private readonly smsService: SendsmsService) { }


  async walletBase(data: CreateWalletBaseDto) {
    const userId = await this.userHelper.getUser().id;

    const nWalletBase = await this.prisma.walletBase.upsert({
      where: {
        id: process.env.WALLET_BASE_ID
      },
      update: {
        ...data,
        points: Number(Number(data.points).toFixed(2)),
        userId
      },
      create: {
        ...data,
        id: process.env.WALLET_BASE_ID,
        points: Number(Number(data.points).toFixed(2)),
        userId
      }
    })


    return nWalletBase;
  }

  async findWalletByUser() {
    const userId = await this.userHelper.getUser().id;

    const wallet = await this.prisma.wallet.findUnique({
      where: {
        userId
      },
      include: {
        user: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true,
            Facility: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })


    if (!wallet) {
      throw new NotFoundException('No wallet found')
    }

    return wallet
  }


  async facilityWallet() {
    const userId = await this.userHelper.getUser().id

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    const wallet = await this.prisma.facilityWallet.findUnique({
      where: {
        facilityId: user.facilityId
      }
    }).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })


    if (!wallet) {
      throw new NotFoundException('No wallet found')
    }

    return wallet
  }


  async findWallet({ id }: FindWalletDto) {

    const wallet = await this.prisma.wallet.findUnique({
      where: {
        id
      },

      include: {
        user: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true,
            Facility: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })


    if (!wallet) {
      throw new NotFoundException('No wallet found')
    }

    return wallet
  }

  async findAll() {
    const allWallets = await this.prisma.wallet.findMany({

      orderBy: {
        updatedAt: 'desc',
      },

      include: {
        user: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true,
            Facility: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })
    return allWallets
  }


  async findAllFacilityWallets() {
    const allWallets = await this.prisma.facilityWallet.findMany({
      include: {
        facility: {
          select: {
            name: true
          }
        }
      }
    }).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })
    return allWallets
  }


  async findTotalFacilityBalance() {

    const totalBalance = await this.prisma.facilityWallet.aggregate({
      _sum: {
        balance: true
      }
    })
    return {
      totalBalance: totalBalance._sum.balance
    }
  }

  async findTotalWalletBalance() {
    const totalBalance = await this.prisma.wallet.aggregate({
      _sum: {
        balance: true
      }
    })
    return {
      totalBalance: totalBalance._sum.balance
    }
  }

  async findTotalTransactionsPaid() {
    const totalTransactions = await this.prisma.walletTransaction.aggregate({
      where: {
        approvedBy: {
          isNot: null
        }
      },
      _sum: {
        points: true
      }
    })
    return {
      totalTransactions: totalTransactions._sum.points
    }
  }


  async update(updateWalletDto: UpdateWalletDto) {
    const wallet = await this.prisma.wallet.update({
      where: {
        id: updateWalletDto.id
      },
      data: {
        balance: Number(Number(updateWalletDto.balance).toFixed(2)),
      }
    }).then(() => ({
      message: 'Wallet updated'
    }))
    return wallet
  }


  async requestCode(data: RequestCodeDto) {


    const user = await this.prisma.user.findUnique({
      where: {
        id: data.userId
      }
    })


    if (!user) {
      throw new NotFoundException('Invalid user ID')
    }


    if (!user.hasWallet) {
      throw new BadRequestException('User does not have a wallet')
    }

    const { phone_number } = user


    const code = codegen();

    const genCode = await this.prisma.walletCodes.create({
      data: {
        code,
        userId: user.id,
      }
    }).then(() => {
      this.eventEmitter.emit('code-requested', new CodeRequestedEvent(phone_number, code))
      return {
        message: 'Code generated',
      }
    }).catch(err => {

      throw new BadRequestException(err)
    })


    return genCode

  }


  async createTransaction(data: CreateTransactionDto) {

    const createdById = await this.userHelper.getUser().id;


    const facility = await this.prisma.user.findUnique({
      where: {
        id: createdById
      },
      include: {
        Facility: {
          select: {
            id: true
          }
        }
      }
    })


    const lastBalance = await this.prisma.wallet.findUnique({
      where: {
        userId: data.userId
      }
    })


    const wallet = this.prisma.walletTransaction.create({
      data: {
        clinicVisitId: data.clinicVisitId,
        points: Number(Number(data.points).toFixed(2)),
        createdById,
        userId: data.userId,
        previousPoints: lastBalance.balance,
        facilityId: facility.Facility.id,
        balance: lastBalance.balance - Number(Number(data.points).toFixed(2))
      }
    })


    const updateMotherWallet = this.prisma.wallet.update({
      where: {
        userId: data.userId
      },

      data: {
        balance: {
          decrement: Number(Number(data.points).toFixed(2))
        }
      }
    })


    const updateFacilityWallet = this.prisma.facilityWallet.update({
      where: {
        facilityId: facility.Facility.id
      },
      data: {
        balance: {
          increment: Number(Number(data.points).toFixed(2))
        }
      }
    })


    const updateVisit = this.prisma.clinicVisit.update({
      where: {
        id: data.clinicVisitId
      },
      data: {
        billed: true
      }
    })


    const transaction = await this.prisma.$transaction([wallet, updateMotherWallet, updateFacilityWallet, updateVisit]).then((data) => {
      this.eventEmitter.emit('transaction-completed', new TransactionCompletedEvent(data[1].userId, data[0].points, data[1].balance))
      return {
        message: 'Transaction completed',
      }
    }).catch(err => {

      throw new BadRequestException(err)
    })

    return transaction

  }


  async facilityTransactions() {
    const userId = await this.userHelper.getUser().id;

    const { facilityId } = await this.prisma.user.findUnique({
      where: {
        id: userId
      },

    })


    const facilityTransactions = await this.prisma.walletTransaction.findMany({
      where: {
        facilityId
      },
      select: {
        id: true,
        createdAt: true,
        points: true,
        user: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true
          }
        },

        approvedBy: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true
          }
        },

        createdBy: {
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

    return facilityTransactions
  }


  async allTransactions() {

    const transactions = await this.prisma.walletTransaction.findMany({
      select: {
        id: true,
        createdAt: true,
        points: true,
        user: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true
          }
        },
        approvedBy: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true
          }
        },

        facility: {
          select: {
            name: true
          }
        },

        createdBy: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true
          }
        },

      },

      orderBy: [
        {
          approvedById: {
            sort: 'desc', nulls: 'first'
          }
        },
        {
          createdAt: 'desc',
        }
      ],
    }).then(data => data).catch(err => {

      throw new BadRequestException(err)
    })

    return transactions


  }

  async approveTransaction({ id }: ApproveTransactionDto) {
    const approvedById = await this.userHelper.getUser().id;
    const transaction = await this.prisma.walletTransaction.findUnique({
      where: {
        id
      }
    })

    if (transaction.approvedById) {
      throw new BadRequestException('Transaction already approved')
    }


    if (!transaction) {
      throw new NotFoundException('No transaction found')
    }

    const { points, clinicVisitId } = transaction

    const { facilityId } = await this.prisma.clinicVisit.findUnique({
      where: {
        id: clinicVisitId
      },
      select: {
        facilityId: true
      }
    })

    const updateWallet = this.prisma.walletTransaction.update({
      where: {
        id
      },
      data: {
        approvedById
      }
    })

    const updateFacilityWallet = this.prisma.facilityWallet.update({
      where: {
        facilityId
      },
      data: {
        balance: {
          decrement: Number(Number(points).toFixed(2))
        }
      }
    })

    const approve = await this.prisma.$transaction([updateWallet, updateFacilityWallet]).then(() => ({
      message: 'Transaction approved'
    })).catch(err => {

      throw new BadRequestException(err)
    })

    return approve
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async createWallets() {
    const walletBase = await this.prisma.walletBase.findUnique({
      where: {
        id: process.env.WALLET_BASE_ID
      }
    })

    if (walletBase) {
      const mothers = await this.prisma.user.findMany({
        where: {
          hasWallet: false,
          role: "Mother"
        }
      })


      if (mothers.length === 0) {
        return
      }




      await Promise.allSettled(mothers.map(async item => {
        const updateWalletStatus = this.prisma.user.update({
          where: {
            id: item.id,
          },
          data: {
            hasWallet: true
          }
        })

        const createWallet = this.prisma.wallet.create({
          data: {
            userId: item.id,
            balance: walletBase.points
          }
        })


        await this.prisma.$transaction([updateWalletStatus, createWallet])

      }))
    }
  }


  @Cron(CronExpression.EVERY_5_MINUTES)
  async createFacilityWallets() {
    const walletBase = await this.prisma.walletBase.findUnique({
      where: {
        id: process.env.WALLET_BASE_ID
      }
    })

    if (walletBase) {
      const facilities = await this.prisma.facility.findMany({
        where: {
          hasWallet: false,
        }
      })


      if (facilities.length === 0) {
        return
      }




      await Promise.allSettled(facilities.map(async item => {
        const updateWalletStatus = this.prisma.facility.update({
          where: {
            id: item.id,
          },
          data: {
            hasWallet: true
          }
        })

        const createWallet = this.prisma.facilityWallet.create({
          data: {
            facilityId: item.id,
            balance: 0
          }
        })


        await this.prisma.$transaction([updateWalletStatus, createWallet])

      }))
    }
  }


  @Cron(CronExpression.EVERY_10_MINUTES)
  async deleteWalletCodes() {

    await this.prisma.walletCodes.deleteMany({
      where: {
        createdAt: {
          lt: dayjs().subtract(10, 'minutes').toDate()
        }
      }
    })
  }

  @OnEvent('code-requested')
  async sendCode(data: CodeRequestedEvent) {

    const { phone_number, code } = data

    const message = `Your verification code is ${code}`

    await this.smsService.sendSMSFn({
      phoneNumber: "+" + phone_number,
      message
    })

  }

  @OnEvent('transaction-completed')
  async sendTransactionCompleted(data: TransactionCompletedEvent) {

    const { userId, balance, points } = data

    const { phone_number } = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        phone_number: true
      }
    })

    const message = `A charge of ${points} points has been made to your account. Your balance is ${balance} points`

    await this.smsService.sendSMSFn({
      phoneNumber: "+" + phone_number,
      message
    })

  }

}
