import { UserHelper } from '../../helpers/user-helper';
import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthMiddleware(new UserHelper())).toBeDefined();
  });
});
