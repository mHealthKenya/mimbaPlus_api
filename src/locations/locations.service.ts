import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import axios from 'axios';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { LocationCreatedEvent } from './events/location-created.event';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationUpdatedEvent } from './events/location-updated.dto';

@Injectable()
export class LocationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(createLocationDto: CreateLocationDto) {
    const newLocation = await this.prisma.locationsCovered
      .create({
        data: {
          ...createLocationDto,
        },
      })
      .then((data) => {
        const { location_name, id } = data;
        this.eventEmitter.emit(
          'location.created',
          new LocationCreatedEvent(location_name, id),
        );
        return data;
      })
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

  async updateLocationFn(updateLocationDto: UpdateLocationDto) {
    const updatedLocation = await this.prisma.locationsCovered
      .update({
        where: {
          id: updateLocationDto.id,
        },

        data: {
          location_name: updateLocationDto.location_name,
        },
      })
      .then((data) => {
        this.eventEmitter.emit(
          'location.updated',
          new LocationUpdatedEvent(data.id, data.location_name),
        );

        return data;
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });

    return updatedLocation;
  }

  async deleteLocation(id: string) {
    const deleteFn = await this.prisma.locationsCovered
      .delete({
        where: {
          id,
        },
      })
      .then(() => ({
        message: 'Location deleted',
      }))
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return deleteFn;
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
            locationsCoveredId: id,
          },

          create: {
            lat,
            lng,
            locationsCoveredId: id,
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

  async getCoordinates() {
    const coordinates = await this.prisma.locationCoordinates
      .findMany()
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return coordinates;
  }

  @OnEvent('location.created')
  async handleLocationCreated(data: LocationCreatedEvent) {
    const { location_name, id } = data;
    return this.getAddressCoordinates(location_name, id);
  }

  @OnEvent('location.updated')
  async handleLocationUpdated(data: LocationUpdatedEvent) {
    const { locationsCoveredId, location_name } = data;
    return this.getAddressCoordinates(location_name, locationsCoveredId);
  }
}
