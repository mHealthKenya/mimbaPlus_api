import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { FacilityCreatedEvent } from './events/facility-created.event';
import axios from 'axios';
import { UpdateFacilityDto } from './dto/update-facility.dto';

@Injectable()
export class FacilitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(createFacilityDto: CreateFacilityDto) {
    const newFacility = await this.prisma.facility
      .create({
        data: {
          ...createFacilityDto,
        },
      })
      .then((data) => {
        const { name, id } = data;

        this.eventEmitter.emit(
          'facility.created',
          new FacilityCreatedEvent(name, id),
        );

        return {
          message: 'Facility created',
          data,
        };
      })
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return newFacility;
  }

  async findAllFacilities() {
    const facilities = await this.prisma.facility.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return facilities;
  }

  async updateFacility(data: UpdateFacilityDto) {
    const { id } = data;

    const updatedFacility = await this.prisma.facility
      .update({
        where: {
          id,
        },

        data: {
          ...data,
        },
      })
      .then((data) => {
        const { name, id } = data;

        this.eventEmitter.emit(
          'facility.created',
          new FacilityCreatedEvent(name, id),
        );
        return data;
      })
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return updatedFacility;
  }

  async deleteFacility(id: string) {
    const del = await this.prisma.facility
      .delete({
        where: {
          id,
        },
      })
      .then((data) => ({
        message: data.name + 'deleted successfully',
      }))
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return del;
  }

  async getCoordinates() {
    const coordinates = await this.prisma.locationCoordinates
      .findMany()
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return coordinates;
  }

  async getAddressCoordinates(address: string, id: string) {
    const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY;
    const encodedAddress = encodeURIComponent(address);

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_KEY}`,
      );

      const { results } = response.data;

      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location;

        return await this.prisma.locationCoordinates.upsert({
          where: {
            facilityId: id,
          },

          create: {
            lat,
            lng,
            facilityId: id,
          },

          update: {
            lat,
            lng,
          },
        });
      }

      return results;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @OnEvent('facility.created')
  async handleFacilityCreated(data: FacilityCreatedEvent) {
    const { name, id } = data;
    return this.getAddressCoordinates(name, id);
  }
}
