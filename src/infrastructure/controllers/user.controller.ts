import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDTO } from 'src/application/dto/create-user.dto';
import { UserService } from 'src/application/services/user.service';
import { UserRole } from 'src/domain/entities/user';
import { Roles } from 'src/infrastructure/common/decorators/roles.decorator';
import { RolesGuard } from 'src/infrastructure/common/guards/roles.guard';
import { ServiceProxy } from 'src/infrastructure/service-proxy/service-proxy';
import { ServiceProxyModule } from 'src/infrastructure/service-proxy/service-proxy.module';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  private readonly userService: UserService;

  constructor(
    @Inject(ServiceProxyModule.USER_SERVICE_PROXY)
    private readonly userServiceProxy: ServiceProxy<UserService>,
  ) {
    this.userService = this.userServiceProxy.getInstance();
  }

  @Post()
  async createUser(@Body() dto: CreateUserDTO) {
    return await this.userService.createUser(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const user = await this.userService.getUserById(id);
    if (!user) throw new NotFoundException('User with such id not found');
    return user;
  }

  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Get('by-passport')
  async getUserByPassport(@Query('passportNumber') passportNumber: string) {
    const user = await this.userService.getUserByPassport(passportNumber);
    if (!user) {
      throw new NotFoundException('User with such Passport Number not found');
    }
    return user;
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    const user = await this.userService.getUserById(id);
    if (!user) throw new NotFoundException('User with such id not found');
    await this.userService.deleteUser(id);
  }

  @Roles(UserRole.MANAGER)
  @Patch('activate/:id')
  async activateuser(@Param('id') id: number) {
    await this.userService.activateUser(id);
    return { message: 'User successfuly activated!' };
  }

  @Roles(UserRole.MANAGER)
  @Get('inactive')
  async getAllInactiveUsers() {
    return await this.userService.getAllInactiveUsers();
  }
}
