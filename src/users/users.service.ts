import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { SendEmail } from '../helpers/send-email';
import { PrismaService } from '../prisma/prisma.service';
import { emailBody } from './../helpers/management-created-email';
import { CreateManagementDto } from './dto/create-management.dto';
import { LoginManagementDto } from './dto/login-management.dto';
import { UpdateManagementDto } from './dto/update-management.dto';
import { ManageMentCreatedEvent } from './events/management-created.event';
import { GetUserByRole } from './dto/get-user-by-role.dto';

export enum Roles {
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

    if (createMgt?.password) {
      pass = createMgt.password;
    } else {
      pass = pass.split('-')[0];
    }

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

  async loginManagement(credentials: LoginManagementDto) {
    const { email, password } = credentials;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const token = await jwt.sign(
      {
        email: user.email,
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      },
    );

    return {
      message: 'User logged in successfully',
      token,
    };
  }

  async updateUser(data: UpdateManagementDto) {
    const { id } = data;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Invalid user ID');
    }

    return await this.prisma.user
      .update({
        where: {
          id,
        },
        data: {
          ...data,
        },
      })
      .then((data) => ({
        message: 'User updated successfully',
        data,
      }))
      .catch((err) => {
        throw new BadRequestException(err);
      });
  }

  async getUsersByRole(data: GetUserByRole) {
    const { role } = data;

    const users = await this.prisma.user
      .findMany({
        where: {
          role,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return users;
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
