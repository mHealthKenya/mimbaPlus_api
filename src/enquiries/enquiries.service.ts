import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserHelper } from '../helpers/user-helper';

@Injectable()
export class EnquiriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userHelper: UserHelper,
  ) {}
  async create(createEnquiryDto: CreateEnquiryDto) {
    const senderId = this.userHelper.getUser().id;

    const user = await this.prisma.user.findUnique({
      where: {
        id: senderId,
      },
    });

    const facilityId = user?.facilityId;

    const newEnquiry = await this.prisma.enquiries
      .create({
        data: {
          ...createEnquiryDto,
          senderId,
          facilityId,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });
    return newEnquiry;
  }

  async findByFacility() {
    const replierId = this.userHelper.getUser().id;

    const user = await this.prisma.user.findUnique({
      where: {
        id: replierId,
      },
    });

    const facilityId = user?.facilityId;

    const enquiries = await this.prisma.enquiries
      .findMany({
        where: {
          facilityId,
        },

        orderBy: {
          createdAt: 'desc',
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return enquiries;
  }

  async replyToEnquiry({ id, replyTitle, replyDescription }: UpdateEnquiryDto) {
    const repliedById = this.userHelper.getUser().id;
    const reply = await this.prisma.enquiries.update({
      where: {
        id,
      },

      data: {
        replyTitle,
        replyDescription,
        repliedById,
      },
    });

    return reply;
  }

  async findCHVEnquiries() {
    const senderId = this.userHelper.getUser().id;

    const enquiries = await this.prisma.enquiries
      .findMany({
        where: {
          senderId,
        },

        orderBy: {
          updatedAt: 'desc',
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return enquiries;
  }
}
