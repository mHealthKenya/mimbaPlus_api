import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { MultiApproveDto } from './dto/multi-approve.dto';
import { PeriodTransactionsDto } from './dto/period-transactions.dto';
import { ReverseWalletDto } from './dto/reverse.dto';
import { Roles } from 'src/users/users.service';

@Injectable()
export class WalletService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userHelper: UserHelper,
    private readonly eventEmitter: EventEmitter2,
    private readonly smsService: SendsmsService,
  ) {}

  async walletBase(data: CreateWalletBaseDto) {
    const userId = await this.userHelper.getUser().id;

    const nWalletBase = await this.prisma.walletBase.upsert({
      where: {
        id: process.env.WALLET_BASE_ID,
      },
      update: {
        ...data,
        points: Number(Number(data.points).toFixed(2)),
        userId,
      },
      create: {
        ...data,
        id: process.env.WALLET_BASE_ID,
        points: Number(Number(data.points).toFixed(2)),
        userId,
      },
    });

    return nWalletBase;
  }

  async findWalletByUser() {
    const userId = await this.userHelper.getUser().id;

    const wallet = await this.prisma.wallet
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
              Facility: {
                select: {
                  name: true,
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

    if (!wallet) {
      throw new NotFoundException('No wallet found');
    }

    return wallet;
  }

  async facilityWallet() {
    const userId = await this.userHelper.getUser().id;

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const wallet = await this.prisma.facilityWallet
      .findUnique({
        where: {
          facilityId: user.facilityId,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    if (!wallet) {
      throw new NotFoundException('No wallet found');
    }

    return wallet;
  }

  async findWallet({ id }: FindWalletDto) {
    const wallet = await this.prisma.wallet
      .findUnique({
        where: {
          id,
        },

        include: {
          user: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
              Facility: {
                select: {
                  name: true,
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

    if (!wallet) {
      throw new NotFoundException('No wallet found');
    }

    return wallet;
  }

  async findAll() {
    const allWallets = await this.prisma.wallet
      .findMany({
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
                  name: true,
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
    return allWallets;
  }

  async findAllFacilityWallets() {
    const allWallets = await this.prisma.facilityWallet
      .findMany({
        include: {
          facility: {
            select: {
              name: true,
            },
          },
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });
    return allWallets;
  }

  async findTotalFacilityBalance() {
    const totalBalance = await this.prisma.facilityWallet.aggregate({
      _sum: {
        balance: true,
      },
    });
    return {
      totalBalance: totalBalance._sum.balance,
    };
  }

  async findTotalWalletBalance() {
    const totalBalance = await this.prisma.wallet.aggregate({
      _sum: {
        balance: true,
      },
    });
    return {
      totalBalance: totalBalance._sum.balance,
    };
  }

  async findTotalTransactionsPaid() {
    const totalTransactions = await this.prisma.walletTransaction.aggregate({
      where: {
        approvedBy: {
          isNot: null,
        },
      },
      _sum: {
        points: true,
      },
    });
    return {
      totalTransactions: totalTransactions._sum.points,
    };
  }

  async update(updateWalletDto: UpdateWalletDto) {
    const wallet = await this.prisma.wallet
      .update({
        where: {
          id: updateWalletDto.id,
        },
        data: {
          balance: Number(Number(updateWalletDto.balance).toFixed(2)),
        },
      })
      .then(() => ({
        message: 'Wallet updated',
      }));
    return wallet;
  }

  async requestCode(data: RequestCodeDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Invalid user ID');
    }

    if (!user.hasWallet) {
      throw new BadRequestException('User does not have a wallet');
    }

    const { phone_number } = user;

    const code = codegen();

    const genCode = await this.prisma.walletCodes
      .create({
        data: {
          code,
          userId: user.id,
          clinicVisitId: data.clinicVisitId,
        },
      })
      .then(() => {
        this.eventEmitter.emit(
          'code-requested',
          new CodeRequestedEvent(phone_number, code),
        );
        return {
          message: 'Code generated',
        };
      })
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return genCode;
  }

  async createTransaction(data: CreateTransactionDto) {
    const createdById = await this.userHelper.getUser().id;

    const facility = await this.prisma.user.findUnique({
      where: {
        id: createdById,
      },
      include: {
        Facility: {
          select: {
            id: true,
          },
        },
      },
    });

    const lastBalance = await this.prisma.wallet.findUnique({
      where: {
        userId: data.userId,
      },
    });

    const wallet = this.prisma.walletTransaction.create({
      data: {
        clinicVisitId: data.clinicVisitId,
        points: Number(Number(data.points).toFixed(2)),
        createdById,
        userId: data.userId,
        previousPoints: lastBalance.balance,
        facilityId: facility.Facility.id,
        balance: lastBalance.balance - Number(Number(data.points).toFixed(2)),
      },
    });

    const updateMotherWallet = this.prisma.wallet.update({
      where: {
        userId: data.userId,
      },

      data: {
        balance: {
          decrement: Number(Number(data.points).toFixed(2)),
        },
      },
    });

    const updateFacilityWallet = this.prisma.facilityWallet.update({
      where: {
        facilityId: facility.Facility.id,
      },
      data: {
        balance: {
          increment: Number(Number(data.points).toFixed(2)),
        },
      },
    });

    const updateVisit = this.prisma.clinicVisit.update({
      where: {
        id: data.clinicVisitId,
      },
      data: {
        billed: true,
      },
    });

    const transaction = await this.prisma
      .$transaction([
        wallet,
        updateMotherWallet,
        updateFacilityWallet,
        updateVisit,
      ])
      .then((data) => {
        this.eventEmitter.emit(
          'transaction-completed',
          new TransactionCompletedEvent(
            data[1].userId,
            data[0].points,
            data[1].balance,
          ),
        );
        return {
          message: 'Transaction completed',
        };
      })
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return transaction;
  }

  async facilityTransactions() {
    const userId = await this.userHelper.getUser().id;

    const { facilityId } = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const facilityTransactions = await this.prisma.walletTransaction
      .findMany({
        where: {
          facilityId,
        },
        select: {
          id: true,
          createdAt: true,
          points: true,
          rejected: true,
          user: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
            },
          },

          approvedBy: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
            },
          },

          createdBy: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return facilityTransactions;
  }

  async allTransactions() {
    const transactions = await this.prisma.walletTransaction
      .findMany({
        select: {
          id: true,
          createdAt: true,
          points: true,
          rejected: true,
          user: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
            },
          },
          approvedBy: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
            },
          },

          facility: {
            select: {
              name: true,
            },
          },

          createdBy: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
            },
          },
        },

        orderBy: [
          {
            approvedById: {
              sort: 'desc',
              nulls: 'first',
            },
          },
          {
            createdAt: 'desc',
          },
        ],
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return transactions;
  }

  async periodTransactionsTotals(data: PeriodTransactionsDto) {
    const transactions = await this.prisma.walletTransaction
      .aggregate({
        _sum: {
          points: true,
        },
        where: {
          createdAt: {
            gte: new Date(data.startDate),
            lte: new Date(data.endDate),
          },
          approvedBy: {
            isNot: null,
          },
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return {
      totalPoints: transactions._sum.points,
    };
  }

  async periodTransactions(data: PeriodTransactionsDto) {
    const transactions = await this.prisma.walletTransaction
      .findMany({
        where: {
          createdAt: {
            gte: new Date(data.startDate),
            lte: new Date(data.endDate),
          },

          approvedBy: {
            isNot: null,
          },
        },
        select: {
          id: true,
          createdAt: true,
          points: true,
          user: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
            },
          },
          approvedBy: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
            },
          },

          facility: {
            select: {
              name: true,
            },
          },

          createdBy: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
            },
          },
        },

        orderBy: [
          {
            approvedById: {
              sort: 'desc',
              nulls: 'first',
            },
          },
          {
            createdAt: 'desc',
          },
        ],
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return transactions;
  }

  async approveTransaction({ id }: ApproveTransactionDto) {
    const approvedById = await this.userHelper.getUser().id;
    const transaction = await this.prisma.walletTransaction.findUnique({
      where: {
        id,
      },
    });

    if (transaction.approvedById) {
      throw new BadRequestException('Transaction already approved');
    }

    if (!transaction) {
      throw new NotFoundException('No transaction found');
    }

    const { points, clinicVisitId } = transaction;

    const { facilityId } = await this.prisma.clinicVisit.findUnique({
      where: {
        id: clinicVisitId,
      },
      select: {
        facilityId: true,
      },
    });

    const updateWallet = this.prisma.walletTransaction.update({
      where: {
        id,
      },
      data: {
        approvedById,
      },
    });

    const updateFacilityWallet = this.prisma.facilityWallet.update({
      where: {
        facilityId,
      },
      data: {
        balance: {
          decrement: Number(Number(points).toFixed(2)),
        },
      },
    });

    const approve = await this.prisma
      .$transaction([updateWallet, updateFacilityWallet])
      .then(() => ({
        message: 'Transaction approved',
      }))
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return approve;
  }

  async multiApprove(data: MultiApproveDto) {
    const approvedById = await this.userHelper.getUser().id;

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    const transactions = await this.prisma.walletTransaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        approvedById: null,
        facilityId: data.facilityId,
      },
    });

    const multi = await Promise.allSettled(
      transactions.map(async (item) => {
        const updateWallet = this.prisma.walletTransaction.update({
          where: {
            id: item.id,
          },
          data: {
            approvedById,
          },
        });

        const updateFacilityWallet = this.prisma.facilityWallet.update({
          where: {
            facilityId: item.facilityId,
          },
          data: {
            balance: {
              decrement: Number(Number(item.points).toFixed(2)),
            },
          },
        });

        const approve = await this.prisma
          .$transaction([updateWallet, updateFacilityWallet])
          .then(() => ({
            message: 'Transactions approved',
          }))
          .catch((err) => {
            throw new BadRequestException(err);
          });

        return approve;
      }),
    );

    return multi;
  }

  async checkPeriodBalance(data: MultiApproveDto) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    const totalBalance = await this.prisma.walletTransaction.aggregate({
      _sum: {
        points: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },

        facilityId: data.facilityId,

        approvedById: null,
      },
    });

    return {
      totalBalance: totalBalance._sum.points,
    };
  }

  async getBaseWallet() {
    const walletBase = await this.prisma.walletBase
      .findUnique({
        where: {
          id: process.env.WALLET_BASE_ID,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return walletBase;
  }

  async reverseTransaction({ id, reason }: ReverseWalletDto) {
    const approvedById = await this.userHelper.getUser().id;

    const transaction = await this.prisma.walletTransaction.findUnique({
      where: {
        id,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Wallet not found');
    }

    if (transaction.approvedById) {
      throw new BadRequestException('Transaction already approved');
    }

    const updateWallet = this.prisma.wallet.update({
      where: {
        userId: transaction.userId,
      },

      data: {
        balance: {
          increment: Number(transaction.points),
        },
      },
    });

    const updateFacilityWallet = this.prisma.facilityWallet.update({
      where: {
        facilityId: transaction.facilityId,
      },
      data: {
        balance: {
          decrement: Number(transaction.points),
        },
      },
    });

    const updateTransaction = this.prisma.walletTransaction.update({
      where: {
        id,
      },

      data: {
        approvedById,
        rejected: true,
        points: 0,
        balance: transaction.previousPoints,
        previousPoints: transaction.previousPoints + transaction.points,
      },
    });

    const transactionReversal = this.prisma.transactionReversal.create({
      data: {
        userId: approvedById,
        reason,
        walletTransactionId: transaction.id,
      },
    });

    const complete = await this.prisma
      .$transaction([
        updateWallet,
        updateFacilityWallet,
        updateTransaction,
        transactionReversal,
      ])
      .then(() => ({
        message: 'Transaction reversed',
      }))
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return complete;
  }

  async motherTransactions() {
    const userId = await this.userHelper.getUser().id;

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (
      !user ||
      user.role !== Roles.MOTHER ||
      !user.hasWallet ||
      !user.active
    ) {
      throw new BadRequestException('Cannot complete request');
    }

    const transactions = await this.prisma.walletTransaction
      .findMany({
        where: {
          userId,
        },

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          facility: {
            select: {
              name: true,
              EmergencyContact: {
                select: {
                  phone: true,
                },
              },
            },
          },

          clinicVisit: {
            select: {
              createdAt: true,
            },
          },

          createdBy: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
            },
          },
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return transactions;
  }

  async walletsWithBalance() {
    const wallets = await this.prisma.wallet
      .findMany({
        where: {
          balance: {
            gt: 0,
          },

          user: {
            active: true,
            hasWallet: true,
            role: Roles.MOTHER,
          },
        },
        include: {
          user: {
            select: {
              f_name: true,
              l_name: true,
              phone_number: true,
              Facility: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return wallets;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async createWallets() {
    const walletBase = await this.prisma.walletBase.findUnique({
      where: {
        id: process.env.WALLET_BASE_ID,
      },
    });

    if (walletBase) {
      const mothers = await this.prisma.user.findMany({
        where: {
          hasWallet: false,
          role: 'Mother',
        },
      });

      if (mothers.length === 0) {
        return;
      }

      await Promise.allSettled(
        mothers.map(async (item) => {
          const updateWalletStatus = this.prisma.user.update({
            where: {
              id: item.id,
            },
            data: {
              hasWallet: true,
            },
          });

          const createWallet = this.prisma.wallet.create({
            data: {
              userId: item.id,
              balance: walletBase.points,
            },
          });

          await this.prisma.$transaction([updateWalletStatus, createWallet]);
        }),
      );
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async createFacilityWallets() {
    const walletBase = await this.prisma.walletBase.findUnique({
      where: {
        id: process.env.WALLET_BASE_ID,
      },
    });

    if (walletBase) {
      const facilities = await this.prisma.facility.findMany({
        where: {
          hasWallet: false,
        },
      });

      if (facilities.length === 0) {
        return;
      }

      await Promise.allSettled(
        facilities.map(async (item) => {
          const updateWalletStatus = this.prisma.facility.update({
            where: {
              id: item.id,
            },
            data: {
              hasWallet: true,
            },
          });

          const createWallet = this.prisma.facilityWallet.create({
            data: {
              facilityId: item.id,
              balance: 0,
            },
          });

          await this.prisma.$transaction([updateWalletStatus, createWallet]);
        }),
      );
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async deleteWalletCodes() {
    await this.prisma.walletCodes.deleteMany({
      where: {
        createdAt: {
          lt: dayjs().subtract(10, 'minutes').toDate(),
        },
      },
    });
  }

  @OnEvent('code-requested')
  async sendCode(data: CodeRequestedEvent) {
    const { phone_number, code } = data;

    const message = `Your verification code is ${code}`;

    await this.smsService.sendSMSFn({
      phoneNumber: '+' + phone_number,
      message,
    });
  }

  @OnEvent('transaction-completed')
  async sendTransactionCompleted(data: TransactionCompletedEvent) {
    const { userId, balance, points } = data;

    const { phone_number } = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        phone_number: true,
      },
    });

    const message = `A charge of ${points} points has been made to your account. Your balance is ${balance} points`;

    await this.smsService.sendSMSFn({
      phoneNumber: '+' + phone_number,
      message,
    });
  }
}
