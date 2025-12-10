import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVisitCountDto } from './dto/create-visit-count.dto';
import { UpdateVisitCountDto } from './dto/update-visit-count.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VisitCountService {
  constructor(private prismaService: PrismaService){}

  async migrateFromClinicVisits() {
  const grouped = await this.prismaService.clinicVisit.groupBy({
    by: ["bioDataId"],
    _count: { bioDataId: true },
  });

  let created = 0;

  for (const group of grouped) {
    // Find motherId
    const bioData = await this.prismaService.bioData.findUnique({
      where: { id: group.bioDataId },
      select: { createdById: true },
    });

    if (!bioData?.createdById) continue;

    const motherId = bioData.createdById;

    await this.prismaService.visitCounter.upsert({
      where: { userId: motherId },
      update: {
        count: group._count.bioDataId,
      },
      create: {
        userId: motherId,
        count: group._count.bioDataId,
      },
    });

    created++;
  }

  return {
    message: "VisitCounter table filled successfully.",
    recordsCreated: created,
  };
}

  async create(createVisitCountDto: CreateVisitCountDto) {
    // 1. Check if user exists
    const mother = await this.prismaService.user.findUnique({
      where: { id: createVisitCountDto.userId },
    });
    if (!mother) {
      throw new NotFoundException('User not found');
    }

    // 2. Upsert VisitCounter (create if not exists, otherwise increment)
    const visitCount = await this.prismaService.visitCounter.upsert({
      where: { userId: createVisitCountDto.userId }, // must be unique in model
      update: { count: { increment: createVisitCountDto.count } }, // increment existing count
      create: {
        userId: createVisitCountDto.userId,
        count: createVisitCountDto.count,
      },
    });

    return visitCount;
  }

  async findAll() {
    const visitCounts = await this.prismaService.visitCounter.findMany();
    if(visitCounts.length === 0 || !visitCounts){
      throw new NotFoundException('No visit counts found');
    }
    return visitCounts;
  }

  async findUserVisitById(userId: string) {
    const foundVisitCount = await this.prismaService.visitCounter.findFirst({
      where: { userId },
    });
    if (!foundVisitCount) {
      throw new NotFoundException('Visit count not found for user');
    }
    return foundVisitCount;
  }

  async getTotalVisitCount(){
    const totalResult = await this.prismaService.visitCounter.aggregate({
      _sum: {
        count: true,
      },
    });

    return totalResult._sum.count ?? 0;
  }

  async update(id: string, updateVisitCountDto: UpdateVisitCountDto) {
    const idStr = String(id);
    const existing = await this.prismaService.visitCounter.findUnique({ where: { id: idStr } });
    if (!existing) {
      throw new NotFoundException('Visit count not found');
    }

    const updated = await this.prismaService.visitCounter.update({
      where: { id: idStr },
      data: {
        // allow updating count and userId (if provided)
        ...(updateVisitCountDto.count !== undefined && { count: updateVisitCountDto.count }),
        ...(updateVisitCountDto.userId !== undefined && { userId: updateVisitCountDto.userId }),
      },
    });

    return updated;
  }

  async remove(id: string) {
    const idStr = String(id);
    const existing = await this.prismaService.visitCounter.findUnique({ where: { id: idStr } });
    if (!existing) {
      throw new NotFoundException('Visit count not found');
    }

    const deleted = await this.prismaService.visitCounter.delete({ where: { id: idStr } });
    return deleted;
  }
}
