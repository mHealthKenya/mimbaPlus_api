import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class WalletcodeverificationMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) { }
  async use(req: any, res: any, next: () => void) {

    const { userId, code } = req.body;

    const walletC = await this.prisma.walletCodes.findUnique({
      where: {
        walletCode: {
          userId,
          code
        }
      }
    })



    if (!walletC) {
      throw new BadRequestException('Invalid code');
    }


    if (walletC) {

      await this.prisma.walletCodes.deleteMany({
        where: {
          userId
        }
      })

      next();
    }
  }
}
