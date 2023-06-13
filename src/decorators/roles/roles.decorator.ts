import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/users/users.service';

export const UserRoles = (...args: Roles[]) => SetMetadata('roles', args);
