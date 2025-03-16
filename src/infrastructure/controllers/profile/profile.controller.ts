import {
  Controller,
  Get,
  UseGuards,
  Request,
  Inject,
  NotFoundException,
  Put,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDTO } from 'src/application/dto/update-profile.dto';
import { ProfileService } from 'src/application/services/profile.service';
import { RolesGuard } from 'src/infrastructure/common/guards/roles.guard';
import { ServiceProxy } from 'src/infrastructure/service-proxy/service-proxy';
import { ServiceProxyModule } from 'src/infrastructure/service-proxy/service-proxy.module';

@Controller('profile')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProfileController {
  private readonly profileService: ProfileService;
  constructor(
    @Inject(ServiceProxyModule.PROFILE_SERVICE_PROXY)
    private readonly profileServiceProxy: ServiceProxy<ProfileService>,
  ) {
    this.profileService = profileServiceProxy.getInstance();
  }

  @Get()
  async getProfile(@Request() req: any) {
    const profile = await this.profileService.getProfile(req.user.id);
    if (!profile) throw new NotFoundException('User not found');
    return profile;
  }
  @Put()
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDTO) {
    const profile = this.profileService.updateProfile(req.user.id, dto);
    if (!profile) throw new NotFoundException('User not found');
    return profile;
  }
}
