import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConsentDto } from './dto/create-consent.dto';

@Injectable()
export class ConsentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createConsentDto: CreateConsentDto) {
    const createConsent = await this.prisma.consentForm
      .create({
        data: createConsentDto,
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });
    return createConsent;
  }

  async findOne(userId: string) {
    const consent = await this.prisma.consentForm
      .findUnique({
        where: {
          userId,
        },
      })
      .then((data) => {
        if (!data) {
          return {
            message: 'Yet to consent',
          };
        }

        return data;
      });
    return consent;
  }
}
