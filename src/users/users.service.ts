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
import { User, UserHelper } from '../helpers/user-helper';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserByRoleAndFacility } from './dto/get-user-by-role-and-facility.dto';
import { GetUserByRole } from './dto/get-user-by-role.dto';
import { LoginManagementDto } from './dto/login-management.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordResetRequestEvent } from './events/password-requested.event';
import { UserCreatedEvent } from './events/user-created-event';
import { SendsmsService } from '../sendsms/sendsms.service';
import { emailRegex, phoneRegex } from 'src/helpers/regex';

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
    private readonly smsService: SendsmsService
  ) { }

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

  async userLogin(user: User) {
    if (!user) {
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

    const rToken = await jwt.sign(
      {
        email: user.email,
        id: user.id,
        role: user.role,
      },
      process.env.JWT_REFRESH,
      {
        expiresIn: '90d',
      },
    );

    return {
      token,
      refreshToken: rToken,
    };
  }

  async loginManagement(credentials: LoginManagementDto) {
    const userL = await this.userHelper.getUser();

    if (userL !== undefined) {
      const { id } = userL;

      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      delete user.password;

      const val = await this.userLogin(userL);

      return {
        message: 'User logged in successfully',
        ...val,
        user,
      };
    }

    const { email, password } = credentials;

    if (!email || !password) {
      throw new BadRequestException('Email and Password are required');
    }


    let user = null

    if (emailRegex.test(email)) {
      user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    } else if (phoneRegex.test(email)) {
      user = await this.prisma.user.findUnique({
        where: {
          phone_number: email,
        },
      });
    }

    if (!user) {
      throw new BadRequestException('Invalid email, phone or password');
    }

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      throw new BadRequestException('Invalid email, phone or password');
    }

    const { id, role } = user;

    const val = await this.userLogin({
      id,
      role,
      email,
    });

    delete user.password;

    return {
      message: 'User logged in successfully',
      ...val,
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

  async getUserInternal(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      },
      select: {
        f_name: true,
        l_name: true
      }
    })

    if (!user) {
      return null
    }

    const fullName = user.f_name + " " + user.l_name

    return fullName
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

          BioData: {
            select: {
              age: true,
            }
          }
        },
      })
      .then(async (data) => {
        return await Promise.all(data.map(async item => ({
          ...item,
          fullName: await this.getUserInternal(item.createdById)
        })))
      })
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^254[0-9]{9}$/


    let user = null

    const isEmail = emailRegex.test(email)
    const isPhone = phoneRegex.test(email)


    if (isEmail) {
      user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    } else if (isPhone) {
      user = await this.prisma.user.findUnique({
        where: {
          phone_number: email,
        },
      });
    }

    if (!user) {
      throw new BadRequestException(
        'The email or phone you provided does not exist in our database',
      );
    }

    const code = (Math.random() + 1).toString(36).substring(7);

    const newRCode = await this.prisma.resetCode
      .create({
        data: {
          email: user.email,
          code,
        },
      })
      .then((data) => {
        this.eventEmitter.emit(
          'password.request',
          new PasswordResetRequestEvent({
            type: isEmail ? 'email' : 'phone',
            email: user.email,
            phone: user.phone_number
          }, data.code),
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
    const { code, password } = data;

    const codeExists = await this.prisma.resetCode.findUnique({
      where: {
        code,
      },
    });

    if (!codeExists) {
      throw new BadRequestException('Invalid code provided');
    }

    const hashedPass = bcrypt.hashSync(password, 10);

    const updateUser = this.prisma.user.update({
      where: {
        email: codeExists.email,
      },
      data: {
        password: hashedPass,
      },
    });

    const deleteCode = this.prisma.resetCode.delete({
      where: {
        code,
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

        include: {
          BioData: {
            select: {
              expected_delivery_date: true,
            },
          },
        },

        orderBy: {
          createdAt: 'desc',
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


  async mothersRegisteredByCHVS() {
    const chvs = await this.prisma.user.findMany({
      where: {
        role: 'CHV'
      },
      select: {
        id: true,
        f_name: true,
        l_name: true
      }
    })

    const mothers = await this.prisma.user.findMany({
      where: {
        role: 'Mother'
      },
      select: {
        id: true,
        f_name: true,
        l_name: true,
        createdById: true
      }
    })

    const mothersByCHV = chvs.map(chv => {
      const count = mothers.filter(mother => mother.createdById === chv.id).length
      return {
        chvId: chv.id,
        chvName: chv.f_name + ' ' + chv.l_name,
        count
      }
    })

    return mothersByCHV
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

  async getUser() {
    const id = this.userHelper.getUser().id;

    const user = await this.prisma.user
      .findUnique({
        where: {
          id,
        },

        include: {
          Facility: {
            select: {
              name: true,
              EmergencyContact: {
                select: {
                  phone: true,
                }
              }
            },
          },
        },
      })
      .then((data) => {
        if (!data) {
          throw new NotFoundException('Invalid user');
        } else {
          return data;
        }
      })
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return user;
  }

  @OnEvent('password.request')
  async handlePasswordRequest(data: PasswordResetRequestEvent) {
    const { options: { type, email, phone } } = data;

    if (type === "email") {
      const msg = emailBodyPass(data);

      await new SendEmail(
        email,
        'Password Reset',
        'We have received a request to reset your password',
        msg,
      ).send();
    } else if (type === "phone") {

      await this.smsService.sendSMSFn({
        phoneNumber: "+" + phone,
        message: `Your password reset code is ${data.code}`
      })
    }

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
