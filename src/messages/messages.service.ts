import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SendsmsService } from 'src/sendsms/sendsms.service';

@Injectable()
export class MessagesService {
  constructor(private prismaService: PrismaService,
              private readonly smsService: SendsmsService
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    return this.prismaService.messageTemplates.create({
      data: createMessageDto
    });
  }

  async sendMessageToNumbers(messageId: string, phoneNumbers: string[]) {
    const messageTemplate = await this.prismaService.messageTemplates.findUnique({
      where: { id: messageId },
    });

    if (!messageTemplate) {
      throw new BadRequestException('Message template not found');
    }

    const messageContent = messageTemplate.body;

   
    const smsData = phoneNumbers.map((phoneNumber) => ({
      phoneNumber,
      message: messageContent,
    }));

    
    return await this.smsService.sendSMSMultipleNumbersFn(smsData)
  }


  findAll() {
    return this.prismaService.messageTemplates.findMany();
  }

  findOne(id: string) {
    return this.prismaService.messageTemplates.findUnique({
      where: { id: id }
    })
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    const updateMsg = this.prismaService.messageTemplates.update({
      where: { id: id },
      data: updateMessageDto
    })
    return {
      message: 'Message updated successfully',
      data: updateMsg
    }
  }

  remove(id: string) {
    return this.prismaService.messageTemplates.delete({
      where: { id: id }
    })
  }
}
