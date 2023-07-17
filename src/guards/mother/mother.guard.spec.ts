import { UserHelper } from '../../helpers/user-helper';
import { PrismaService } from '../../prisma/prisma.service';
import { MotherPrivateDataGuard } from './mother.guard';

describe('MotherGuard', () => {
  it('should be defined', () => {
    expect(
      new MotherPrivateDataGuard(new PrismaService(), new UserHelper()),
    ).toBeDefined();
  });
});
