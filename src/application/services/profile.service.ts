import { Profile } from 'src/domain/entities/profile';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { ProfileMapper } from '../mappers/profile.mapper';
import { UpdateProfileDTO } from '../dto/update-profile.dto';
import { User } from 'src/domain/entities/user';

export class ProfileService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getProfile(id: number): Promise<Profile | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    const profile = ProfileMapper.toProfile(user);
    return profile;
  }

  async updateProfile(id: number, dto: UpdateProfileDTO) {
    const oldUser = await this.userRepository.findById(id);
    if (!oldUser) return null;

    const newUser = new User(
      dto.fullName,
      dto.passportNumber,
      dto.identificationNumber,
      dto.phone,
      dto.email,
      oldUser.passwordHash,
    );
    newUser.id = oldUser.id;
    newUser.isActive = oldUser.isActive;
    newUser.isForeign = oldUser.isForeign;
    newUser.role = oldUser.role;
    
    const user = await this.userRepository.update(newUser);
    if (!user) return null;
    return ProfileMapper.toProfile(user);
  }
}
