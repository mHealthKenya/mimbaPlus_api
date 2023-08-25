import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateKnowledgematerialDto } from './dto/create-knowledgematerial.dto';
import { UpdateKnowledgematerialDto } from './dto/update-knowledgematerial.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class KnowledgematerialService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKnowledgematerialDto: CreateKnowledgematerialDto) {
    const knwmaterial = await this.prisma.knowledgeMaterial
      .create({
        // some help with prisma model and below
        data: {
          ...createKnowledgematerialDto,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return knwmaterial;
  }

  findAll() {
    const allKnowledgeMaterial = this.prisma.knowledgeMaterial.findMany();
    return allKnowledgeMaterial;
  }

  findOne(id: string) {
    const knowledgematerial = this.prisma.knowledgeMaterial.findUnique({
      where: { id },
    });
    return knowledgematerial;
  }

  update(id: string, updateKnowledgematerialDto: UpdateKnowledgematerialDto) {
    const updatedKnowledgeBase = this.prisma.knowledgeMaterial
      .update({
        where: { id },
        data: updateKnowledgematerialDto,
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return updatedKnowledgeBase;
  }

  remove(id: string) {
    return this.prisma.knowledgeMaterial.delete({ where: { id } });
  }

  async shareKnowledgeMaterial(materialId: string, userIds: string) {
    const material = await this.prisma.knowledgeMaterial.findUnique({
      where: { id: materialId },
    });

    if (!material) {
      throw new NotFoundException(
        `Knowledge material with ID ${materialId} not found`,
      );
    }

    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });

    if (users.length !== userIds.length) {
      const existingUserIds = users.map((user) => user.id);
      // const missingUserIds = userIds.filter(
      //   (id) => !existingUserIds.includes(id),
      // );
      throw new NotFoundException('Users with IDs not found');
    }

    const sharedMaterial = await this.prisma.knowledgeMaterial.update({
      where: { id: materialId },
      data: {
        sharedWith: {
          connect: { id: userIds }, // Assuming userId is the ID of the user you want to share with
        },
      },
    });

    return sharedMaterial;
  }
}
