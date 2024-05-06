import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { create } from 'domain';

const createWallet: CreateWalletDto = {
  userId: '9c50e4b7-6939-4249-9b65-d134414eac19',
  balance: 0,
}

const prisma = {
  create: jest.fn().mockImplementation(async () => ({
    id: '9c50e4b7-6939-4249-9b65-d134414eac19',
    userId: '9c50e4b7-6939-4249-9b65-d134414eac19',
    balance: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),

}


describe('WalletService', () => {
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletService],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create Wallet', () => {
    it('should create a new wallet', async () => {
      const newWallet = await service.createWallet(createWallet);
      expect(newWallet).toBeDefined();
    })
  })
});