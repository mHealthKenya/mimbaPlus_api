import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { LevelGuard } from './level.guard';
import { UserHelper } from '../../helpers/user-helper';

describe('Level Guard', () => {
  it('should be defined', () => {
    expect(
      new LevelGuard(new PrismaService(), new Reflector(), new UserHelper()),
    ).toBeDefined();
  });
});
