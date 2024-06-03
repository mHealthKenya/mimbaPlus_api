import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { OtpService } from '../otp/otp.service'; // Ensure this import is correct

const createWalletDto = {
  userId: 'userId',
  balance: 0,
};

const mockOtpService = {
  generateOtp: jest.fn().mockResolvedValue('1234'),
  verifyOtp: jest.fn().mockResolvedValue(true),
};

const mockPrismaService = {
  user: {
    create: jest.fn().mockResolvedValue({
      id: 'sampleId',
      f_name: 'User',
      l_name: 'Here',
      gender: 'Male',
      email: 'sample@user.com',
      phone_number: '254123456789',
      national_id: '12345678',
      password: 'hashed',
      role: 'Role',
      facilityId: 'facilityId',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    findUnique: jest.fn().mockResolvedValue({
      id: 'sampleId',
      f_name: 'User',
      l_name: 'Updated',
      facilityId: 'facilityId',
      gender: 'Male',
      email: 'sample@user.com',
      phone_number: '254123456789',
      national_id: '12345678',
      password: 'hashed',
      role: 'Role',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  },
  wallet: {
    create: jest.fn().mockResolvedValue({
      userId: 'userId',
      balance: 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    findUnique: jest.fn().mockResolvedValue({
      id: 'sampleId',
      userId: 'userId',
      balance: 0,
    }),
    update: jest.fn().mockResolvedValue({
      id: 'sampleId',
      userId: 'userId',
      balance: 1000,
    }),
  },
  transaction: {
    create: jest.fn().mockResolvedValue({
      userId: 'userId',
      facilityId: 'facilityId',
      amount: 100,
      type: 'PAYMENT',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  },
};

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: OtpService, useValue: mockOtpService },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a wallet', async () => {
    const newWallet = await service.createMotherWallet(createWalletDto);
    expect(newWallet.message).toEqual('Wallet created successfully');
  });

  it('should throw NotFoundException if user does not exist', async () => {
    mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
    await expect(service.createMotherWallet(createWalletDto)).rejects.toThrow(NotFoundException);
  });

  it('should return user wallet if found', async () => {
    const wallet = await service.getWalletByUserId(createWalletDto.userId);
    expect(wallet.userId).toEqual('userId');
  });

  it('should throw NotFoundException error if wallet not found', async () => {
    mockPrismaService.wallet.findUnique.mockResolvedValueOnce(null);
    await expect(service.getWalletByUserId(createWalletDto.userId)).rejects.toThrow(NotFoundException);
  });

  it('should transfer tokens from mother wallet to facility wallet', async () => {
    const userId = 'user-id';
    const facilityId = 'facility-id';
    const amount = 100;
    const phone = 'user-phone';
    const purpose = 'MOTHER TO FACILITY TRANSACTION';
    const otp = '1234';

    mockOtpService.generateOtp.mockResolvedValue(otp);
    mockOtpService.verifyOtp.mockResolvedValue(true);

    const userWallet = { userId: userId, balance: 200 };
    const facilityWallet = { facilityId: facilityId, balance: 50 };

    mockPrismaService.wallet.findUnique.mockResolvedValueOnce(userWallet);
    mockPrismaService.wallet.findUnique.mockResolvedValueOnce(facilityWallet);

    await service.transferTokenFromMotherToFacility(userId, facilityId, amount, phone);

    expect(mockOtpService.generateOtp).toHaveBeenCalledWith(userId, amount);
    expect(mockOtpService.verifyOtp).toHaveBeenCalledWith(phone, otp);
    expect(mockPrismaService.wallet.findUnique).toHaveBeenCalledWith({
      where: { userId: userId },
    });
    expect(mockPrismaService.wallet.findUnique).toHaveBeenCalledWith({
      where: { facilityId: facilityId },
    });
    expect(mockPrismaService.wallet.update).toHaveBeenCalledWith({
      where: { userId: userId },
      data: { balance: userWallet.balance - amount },
    });
    expect(mockPrismaService.wallet.update).toHaveBeenCalledWith({
      where: { facilityId: facilityId },
      data: { balance: facilityWallet.balance + amount },
    });
    expect(mockPrismaService.transaction.create).toHaveBeenCalledTimes(2);
    expect(mockPrismaService.transaction.create).toHaveBeenCalledWith(expect.objectContaining({
      userId,
      facilityId,
      amount,
      type: 'PAYMENT',
      purpose,
    }));
  });

  it('should throw an error if OTP verification is false', async () => {
    const userId = 'userId';
    const facilityId = 'facilityId';
    const amount = 100;
    const phone = 'user-phone';
    const otp = '1234';

    mockOtpService.generateOtp.mockResolvedValue(otp);
    mockOtpService.verifyOtp.mockResolvedValue(false);

    await expect(service.transferTokenFromMotherToFacility(userId, facilityId, amount, phone)).rejects.toThrowError('Invalid OTP');

    expect(mockOtpService.generateOtp).toHaveBeenCalledWith(userId, amount);
    expect(mockOtpService.verifyOtp).toHaveBeenCalledWith(phone, otp);
    expect(mockPrismaService.wallet.findUnique).not.toHaveBeenCalled();
    expect(mockPrismaService.wallet.update).not.toHaveBeenCalled();
    expect(mockPrismaService.transaction.create).not.toHaveBeenCalled();
  });
});
