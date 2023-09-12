import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBirthplanDto } from './dto/create-birthplan.dto';
import { UpdateBirthplanDto } from './dto/update-birthplan.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BirthplanService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createBirthplanDto: CreateBirthplanDto) {
    const nBirthPlan = await this.prisma.birthPlan
      .create({
        data: {
          ...createBirthplanDto,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });
    return nBirthPlan;
  }

  findAll() {
    return `This action returns all birthplan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} birthplan`;
  }

  update(id: number, updateBirthplanDto: UpdateBirthplanDto) {
    return `This action updates a #${id} birthplan`;
  }

  remove(id: number) {
    return `This action removes a #${id} birthplan`;
  }
}
