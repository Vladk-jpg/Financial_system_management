import { Profile } from 'src/domain/entities/profile';
import { UpdateProfileDTO } from '../dto/update-profile.dto';

export interface IProfileService {
  getProfile(id: number): Promise<Profile | null>;
  updateProfile(id: number, dto: UpdateProfileDTO): Promise<Profile | null>;
}