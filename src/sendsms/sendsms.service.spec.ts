import { Test, TestingModule } from '@nestjs/testing';
import { SendsmsService } from './sendsms.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('SendsmsService', () => {
  let service: SendsmsService;
  let prisma: PrismaService;

  const mockUser = {
    id: 'user-id-1',
    phoneNumber: ['+254700000001', '+254700000002'],
  };

  const mockScheduledMessages = [
    {
      id: 'msg1',
      message: 'Test message',
      scheduledAt: new Date(Date.now() - 1000), // already due
      sent: false,
      user: mockUser,
    },
  ];

  const sendSMSMultipleNumbersFn = jest.fn(async (smsData) => smsData);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendsmsService,
        {
          provide: PrismaService,
          useValue: {
            scheduledMessage: {
              findMany: jest.fn().mockResolvedValue(mockScheduledMessages),
              update: jest.fn().mockResolvedValue({}),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SendsmsService>(SendsmsService);
    prisma = module.get<PrismaService>(PrismaService);

    service.sendSMSMultipleNumbersFn = sendSMSMultipleNumbersFn;
  });

  it('should send messages and update status', async () => {
    await service.sendPendingScheduledMessages();

    
    expect(sendSMSMultipleNumbersFn).toHaveBeenCalledWith([
      { phoneNumber: '+254700000001', message: 'Test message' },
      { phoneNumber: '+254700000002', message: 'Test message' },
    ]);

    expect(prisma.scheduledMessage.update).toHaveBeenCalledWith({
      where: { id: 'msg1' },
      data: { sent: true, updatedAt: expect.any(Date) },
    });
  });

  it('should retry failed messages and increment retry count', async () => {
    sendSMSMultipleNumbersFn.mockRejectedValueOnce(new Error('Sending failed'));

    await service.sendPendingScheduledMessages();

    expect(prisma.scheduledMessage.update).toHaveBeenCalledWith({
      where: { id: 'msg1' },
      data: {
        retries: { increment: 1 },
        updatedAt: expect.any(Date),
      },
    });
  });
});
