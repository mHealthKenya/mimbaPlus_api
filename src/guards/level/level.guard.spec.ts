import { UserHelper } from '../../helpers/user-helper';
import { PrismaService } from '../../prisma/prisma.service';
import { LevelGuard } from './level.guard';

describe('Level Guard', () => {
  it('should be defined', () => {
    expect(new LevelGuard(new PrismaService(), new UserHelper())).toBeDefined();
  });
});
