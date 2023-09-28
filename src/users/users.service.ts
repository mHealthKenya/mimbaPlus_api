import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { emailBodyPass } from '../helpers/password-requested-email';
import { SendEmail } from '../helpers/send-email';
import { emailBody } from '../helpers/user-created-email';
import { UserHelper } from '../helpers/user-helper';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserByRoleAndFacility } from './dto/get-user-by-role-and-facility.dto';
import { GetUserByRole } from './dto/get-user-by-role.dto';
import { LoginManagementDto } from './dto/login-management.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordResetRequestEvent } from './events/password-requested.event';
import { UserCreatedEvent } from './events/user-created-event';

export enum Roles {
  ADMIN = 'Admin',
  FACILITY = 'Facility',
  CHV = 'CHV',
  MOTHER = 'Mother',
}

export const RoleSuperiority: Record<Roles, number> = {
  [Roles.ADMIN]: 4,
  [Roles.FACILITY]: 3,
  [Roles.CHV]: 2,
  [Roles.MOTHER]: 1,
};

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly userHelper: UserHelper,
  ) {}

  async createUser(createUser: CreateUserDto) {
    const id = uuidv4();
    const pass = (Math.random() + 1).toString(36).substring(7);

    const password = bcrypt.hashSync(pass, 10);

    const createdById = this.userHelper.getUser().id;
    const role = this.userHelper.getUser().role;

    if (RoleSuperiority[role] <= RoleSuperiority[createUser.role]) {
      throw new ForbiddenException(
        'Cannot Create a user with a higher or equal ranking.',
      );
    }

    const newUser = await this.prisma.user
      .create({
        data: {
          ...createUser,
          id,
          password,
          createdById,
        },
      })
      .then((data) => {
        this.eventEmitter.emit(
          'user.created',
          new UserCreatedEvent(data.email, pass, createdById, role),
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

  async countUsersByRole() {
    const users = await this.prisma.user
      .groupBy({
        by: ['role'],

        _count: {
          role: true,
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

          BioData: role === Roles.MOTHER,
          BirthPlan: role === Roles.MOTHER,
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

  async passwordResetRequest(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException(
        'The email you provided does not exist in our database',
      );
    }

    const code = (Math.random() + 1).toString(36).substring(7);

    const newRCode = await this.prisma.resetCode
      .create({
        data: {
          email,
          code,
        },
      })
      .then((data) => {
        this.eventEmitter.emit(
          'password.request',
          new PasswordResetRequestEvent(data.email, data.code),
        );
        return {
          message: 'Password reset code successfully sent',
        };
      })
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return newRCode;
  }

  async resetPassword(data: UpdatePasswordDto) {
    const { code, email, password } = data;

    const codeExists = await this.prisma.resetCode.findUnique({
      where: {
        email_code: { email, code },
      },
    });

    if (!codeExists) {
      throw new BadRequestException('Invalid email or code provided');
    }

    const hashedPass = bcrypt.hashSync(password, 10);

    const updateUser = this.prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPass,
      },
    });

    const deleteCode = this.prisma.resetCode.delete({
      where: {
        email_code: { email, code },
      },
    });

    return await this.prisma
      .$transaction([updateUser, deleteCode])
      .then(() => ({
        message: 'Password reset was successful',
      }));
  }

  async findCHVMothers() {
    const chvId = this.userHelper.getUser().id;

    const mothers = await this.prisma.user
      .findMany({
        where: {
          role: Roles.MOTHER,
          createdById: chvId,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return mothers;
  }

  async allUsers() {
    const all = await this.prisma.user
      .count()
      .then((data) => ({
        total_users: data,
      }))
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return all;
  }

  async usersByRole() {
    const userRoles = await this.prisma.user
      .groupBy({
        by: ['role'],
        _count: {
          role: true,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return userRoles;
  }

  async usersByFacility() {
    const users = await this.prisma.user.groupBy({
      by: ['facilityId'],

      _count: {
        facilityId: true,
      },

      where: {
        role: 'Mother',
      },
    });

    const facilityNames = await this.prisma.facility.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const facilityUsers = facilityNames.map((facility) => ({
      facilityId: facility.id,
      count:
        users.find((user) => user.facilityId === facility.id)?._count
          ?.facilityId || 0,
      facilityName: facility.name,
    }));

    return facilityUsers;
  }

  async chVsByFacility() {
    const users = await this.prisma.user.groupBy({
      by: ['facilityId'],

      _count: {
        facilityId: true,
      },

      where: {
        role: 'CHV',
      },
    });

    const facilityNames = await this.prisma.facility.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const facilityUsers = facilityNames.map((facility) => ({
      facilityId: facility.id,
      count:
        users.find((user) => user.facilityId === facility.id)?._count
          ?.facilityId || 0,
      facilityName: facility.name,
    }));

    return facilityUsers;
  }

  @OnEvent('password.request')
  async handlePasswordRequest(data: PasswordResetRequestEvent) {
    const { email } = data;

    const msg = emailBodyPass(data);

    await new SendEmail(
      email,
      'Password Reset',
      'We have received a request to reset your password',
      msg,
    ).send();
  }

  @OnEvent('user.created')
  async handleManagementCreated(event: UserCreatedEvent) {
    const { email, role, createdById } = event;

    if (role === Roles.CHV) {
      await this.prisma.cHVTargets.upsert({
        where: {
          userId: createdById,
        },

        create: {
          userId: createdById,
          current: 1,
        },

        update: {
          current: {
            increment: 1,
          },
        },
      });
    }

    const msg = emailBody(event);

    await new SendEmail(
      email,
      'Welcome to M+',
      'You have been added to the team',
      msg,
    ).send();
  }
}
