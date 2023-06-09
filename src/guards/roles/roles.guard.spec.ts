import { Reflector } from '@nestjs/core';
import { UserHelper } from '../../helpers/user-helper';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  it('should be defined', () => {
    expect(new RolesGuard(new Reflector(), new UserHelper())).toBeDefined();
  });
});
