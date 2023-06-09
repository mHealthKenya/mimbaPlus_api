import { emailBody } from './../helpers/management-created-email';
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateManagementDto } from './dto/create-management.dto';
import * as bcrypt from 'bcryptjs';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ManageMentCreatedEvent } from './events/management-created.event';
import { SendEmail } from '../helpers/send-email';

export enum Roles {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  FACILITY = 'Facility',
  CHV = 'CHV',
  MOTHER = 'Mother',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createManagement(createMgt: CreateManagementDto) {
    let pass = uuidv4();

    pass = pass.split('-')[0];

    const password = bcrypt.hashSync(pass, 10);

    const newUser = await this.prisma.user
      .create({
        data: {
          ...createMgt,
          password,
        },
      })
      .then((data) => {
        this.eventEmitter.emit(
          'management.created',
          new ManageMentCreatedEvent(data.email, pass),
        );

        return {
          message: 'User created successfully',
          data,
        };
      })
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return newUser;
  }

  @OnEvent('management.created')
  async handleManagementCreated(event: ManageMentCreatedEvent) {
    const { email } = event;

    const msg = emailBody(event);

    await new SendEmail(
      email,
      'Welcome to M+',
      'Ypu have been added to the team',
      msg,
    ).send();
  }
}
