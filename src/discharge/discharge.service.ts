import { BadRequestException, Injectable } from '@nestjs/common';
import { UserHelper } from 'src/helpers/user-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDischargeDto } from './dto/create-discharge.dto';

@Injectable()
export class DischargeService {

  constructor(private readonly prisma: PrismaService, private readonly userHelper: UserHelper) { }

  async create(createDischargeDto: CreateDischargeDto, files: string[]) {


    const userId = await this.userHelper.getUser().id;

    const requestDischarge = await this.prisma.dischargeRequest.create({
      data: {
        userId,
        admissionId: createDischargeDto.admissionId,
        files
      }
    }).then(data => data).catch(err => {
      throw new BadRequestException(err)
    })

    return requestDischarge;
  }
}
