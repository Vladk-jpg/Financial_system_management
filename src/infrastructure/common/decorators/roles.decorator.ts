import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/domain/entities/user';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);