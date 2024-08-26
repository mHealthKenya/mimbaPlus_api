import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import axios from 'axios';
import { UserHelper } from 'src/helpers/user-helper';
import { Roles } from 'src/users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { CreateEmergencyContactDto } from './dto/emergency-contact.dto';
import { GetEmergencyContactDto } from './dto/get-emergency-contact.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { FacilityCreatedEvent } from './events/facility-created.event';

@Injectable()
export class FacilitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly userHelper: UserHelper,
  ) { }
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
        message: data.name + ' deleted successfully',
      }))
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return del;
  }

  async getFacilityById(id: string) {
    const facility = await this.prisma.facility
      .findUnique({
        where: {
          id,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return facility;
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

  async countFacilities() {
    const count = await this.prisma.facility.count().then((data) => data);

    return {
      count,
    };
  }

  async createEmergencyContact(data: CreateEmergencyContactDto) {
    const newContact = await this.prisma.emergencyContact.upsert({
      where: {
        facilityId: data.facilityId,
      },

      create: {
        ...data,
      },

      update: {
        ...data,
      },
    }).then(data => data).catch(err => {
      throw new BadRequestException(err);
    })

    return newContact
  }

  async addEmergencyContact(data: CreateEmergencyContactDto) {
    const { phone } = data;
    const userId = await this.userHelper.getUser().id;

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.role === Roles.FACILITY) {
      await this.createEmergencyContact({
        phone,
        facilityId: user.facilityId,
      });
    } else {
      await this.createEmergencyContact(data)
    }
  }


  async getEmergencyContact({ facilityId }: GetEmergencyContactDto) {
    const contact = await this.prisma.emergencyContact
      .findUnique({
        where: {
          facilityId,
        },
        include: {
          facility: {
            select: {
              name: true,
            }
          }
        }
      })
      .then(data => {
        if (!data) {
          return null
        }

        return data
      })
      .catch(err => {
        throw new BadRequestException(err);
      })

    return contact
  }

  async allEmergencyContacts() {
    const contacts = await this.prisma.emergencyContact
      .findMany({
        include: {
          facility: {
            select: {
              name: true,
            }
          }
        }
      })
      .then(data => data)
      .catch(err => {
        throw new BadRequestException(err);
      })

    return contacts
  }

  @OnEvent('facility.created')
  async handleFacilityCreated(data: FacilityCreatedEvent) {
    const { name, id } = data;
    return this.getAddressCoordinates(name, id);
  }
}
