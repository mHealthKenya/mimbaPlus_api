import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prismaService: PrismaService) {}


  async createWallet(createWalletDto: CreateWalletDto){
    const newWallet = await this.prismaService.wallet.create({ data: {...createWalletDto, balance : 0 }}).then((data) => {
      return data;
    }).catch((err) => {throw new Error(err)})
    return newWallet;
  }

  async generateToken(userId: string, amount: number): Promise<number> {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const currentBalance = await this.prismaService.wallet.findUnique({ where: { id: userId } });
    let curbal = 0 

    if(currentBalance){
      curbal = currentBalance.balance
    }

    const newBalance = await this.prismaService.wallet.update({
      where: { id: userId },
      data: { balance: curbal + amount },
    })

    // Ensure the amount is at least 1
    return newBalance.balance;
  }


  create(createWalletDto: CreateWalletDto) {
    return 'This action adds a new wallet';
  }

  findAll() {
    return `This action returns all wallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }

  
}
