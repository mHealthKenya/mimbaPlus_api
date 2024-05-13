import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { create } from 'domain';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const createWallet: CreateWalletDto = {
  userId: 'userId',
  balance: 0,
}

const mockOtpService = {
  generateOtp: jest.fn().mockImplementation(async () => '123456'),
  verifyOtp: jest.fn().mockImplementation(async () => true),
}


describe('WalletService', () => {
  const prismaService = {
    user: {
      create: jest.fn().mockImplementation(async () => ({
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
      })),
      findUnique: jest.fn().mockImplementation(async () => [
        {
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
        },
      ]),
    },
    wallet: {
      create: jest.fn().mockImplementation(async () => ({
        userId: 'userId',
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      findUnique: jest.fn().mockImplementation(async () => ({
        id: 'sampleId',
        userId: 'userId',
        balance: 0,
      })),
      update: jest.fn().mockImplementation(async () => ({
        id: 'sampleId',
        userId: 'userId',
        balance: 1000,
      })),
    },
    transaction: {
      create:  jest.fn().mockImplementation(async () => ({
        userId: 'userId',
        facilityId: 'facilityId',
        amount: 100,
        type: 'PAYMENT',
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    }
  }
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletService, PrismaService, {provide: 'OtpService', useValue: mockOtpService}],
    })
    .overrideProvider(PrismaService)
    .useValue(prismaService)
    .compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a wallet', async () => {
    const newWallet = await service.createWallet(createWallet);
    expect(newWallet.message).toEqual('Wallet created successfully')
  });

  it('should throw NotFoundException if user does not exist', async () => {
    prismaService.user.findUnique.mockRejectedValue(null);
    await expect(service.createWallet(createWallet)).rejects.toThrow(NotFoundException);
  })

  it('should return user wallet if found', async () => {
    const wallet = await service.getWalletByUserId(createWallet.userId);
    expect(wallet.userId).toEqual('userId');
  })

  it('should throw NotFoundException error if wallet not found', () => {
    prismaService.wallet.findUnique.mockRejectedValue(null);
    expect(service.getWalletByUserId(createWallet.userId)).rejects.toThrow(NotFoundException);  
  })

  it('should transfer tokens from mother wallet to facility wallet', async () => {
    const userId = 'user-id';
    const facilityId = 'facility-id';
    const amount = 100;
    const phone = 'user-phone';
    const purpose = 'MOTHER TO FACILITY TRANSACTION';
    const otp = '123456';

    mockOtpService.generateOtp.mockResolvedValue(otp);
    mockOtpService.verifyOtp.mockResolvedValue(true)

    const userWallet = {userId: userId, balance: 200}
    const facilityWallet = {facilityId: facilityId, balance: 50}

    prismaService.wallet.findUnique.mockResolvedValue(userWallet);

    await service.transferTokenFromMotherToFacility(userId, facilityId, amount, phone)

    expect(mockOtpService.generateOtp).toHaveBeenCalledWith(userId, amount);
    expect(mockOtpService.verifyOtp).toHaveBeenCalledWith(phone, otp);
    expect(prismaService.wallet.findUnique).toHaveBeenCalledWith({
      where: {
        userId: userId,
      },
    })
    expect(prismaService.wallet.findUnique).toHaveBeenCalledWith({
      where: {
        facilityId: facilityId,
      },
    })

    expect(prismaService.wallet.update).toHaveBeenCalledWith({
      where: { userId: userId},
      data: { balance:  userWallet.balance - amount}
    });

    expect(prismaService.wallet.update).toHaveBeenCalledWith({
      where: { facilityId: facilityId},
      data: { balance: facilityWallet.balance + amount}
    })

    expect(prismaService.transaction.create).toHaveBeenCalledTimes(2);
    expect(prismaService.transaction.create).toHaveBeenCalledWith(expect.objectContaining({
      userId,
      facilityId,
      amount,
      type: 'PAYMENT',
      purpose,
    }))
  })

  it('should throw an error if OTP verfication is false', async () => {
    const userId = 'userId';
    const facilityId = 'facilityId'
    const amount = 100
    const phone = 'user-phone';
    const otp = '123456';

    mockOtpService.generateOtp.mockResolvedValue(otp);
    mockOtpService.verifyOtp.mockResolvedValue(false)

    await expect(service.transferTokenFromMotherToFacility(userId, facilityId, amount, phone)).rejects.toThrowError('Invalid OTP')

    expect(mockOtpService.generateOtp).toHaveBeenCalledWith(userId, amount)
    expect(mockOtpService.verifyOtp).toHaveBeenCalledWith(userId, otp)

    expect(prismaService.wallet.findUnique).not.toHaveBeenCalled()
    expect(prismaService.wallet.update).not.toHaveBeenCalled()
    expect(prismaService.wallet.create).not.toHaveBeenCalled()
  })
  
});