import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

const createWallet: CreateWalletDto = {
  userId: '',
  balance: 0,
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
});
