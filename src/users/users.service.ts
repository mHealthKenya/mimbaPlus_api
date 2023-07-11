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
import { emailBody } from '../helpers/user-created-email';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserByRole } from './dto/get-user-by-role.dto';
import { LoginManagementDto } from './dto/login-management.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCreatedEvent } from './events/user-created-event';
import { GetUserByRoleAndFacility } from './dto/get-user-by-role-and-facility.dto';

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

  async createUser(createUser: CreateUserDto) {
    const id = uuidv4();
    const pass = (Math.random() + 1).toString(36).substring(7);

    const password = bcrypt.hashSync(pass, 10);

    const newUser = await this.prisma.user
      .create({
        data: {
          ...createUser,
          id,
          password,
        },
      })
      .then((data) => {
        this.eventEmitter.emit(
          'user.created',
          new UserCreatedEvent(data.email, pass),
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

  async getAllUsers() {
    const allUsers = await this.prisma.user
      .findMany({
        include: {
          Facility: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return allUsers;
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

    delete user.password;

    return {
      message: 'User logged in successfully',
      token,
      user,
    };
  }

  async updateUser(data: UpdateUserDto) {
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

        include: {
          Facility: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return users;
  }

  async getUserByRoleAndFacility(data: GetUserByRoleAndFacility) {
    const { facilityId, role } = data;

    const users = await this.prisma.user
      .findMany({
        where: {
          facilityId,
          role,
        },

        include: {
          Facility: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return users;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user
      .findUnique({
        where: {
          id,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return user;
  }

  @OnEvent('user.created')
  async handleManagementCreated(event: UserCreatedEvent) {
    const { email } = event;

    const msg = emailBody(event);

    await new SendEmail(
      email,
      'Welcome to M+',
      'You have been added to the team',
      msg,
    ).send();
  }
}
