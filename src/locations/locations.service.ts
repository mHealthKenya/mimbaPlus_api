import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createLocationDto: CreateLocationDto) {
    const newLocation = await this.prisma.locationsCovered
      .create({
        data: {
          ...createLocationDto,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });
    return newLocation;
  }

  async findAll() {
    const allLocations = await this.prisma.locationsCovered
      .findMany({
        orderBy: {
          updatedAt: 'desc',
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });
    return allLocations;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} location`;
  // }

  // update(id: number, updateLocationDto: UpdateLocationDto) {
  //   return `This action updates a #${id} location`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} location`;
  // }
}
