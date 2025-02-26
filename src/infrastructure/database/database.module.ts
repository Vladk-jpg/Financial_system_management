import { Module } from '@nestjs/common';
import { InMemoryUserRepository } from './repositories/user.repository.impl';
import { USER_REPOSITORY } from 'src/shared/constants/constants';

@Module({
    providers: [
      {
        provide: USER_REPOSITORY,
        useClass: InMemoryUserRepository,
      },
    ],
    exports: [USER_REPOSITORY], 
  })
  export class DatabaseModule {}