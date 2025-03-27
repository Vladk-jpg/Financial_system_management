import { Profile } from 'src/domain/entities/profile';
import { User } from 'src/domain/entities/user';

export class ProfileMapper {
  static toProfile(user: User): Profile {
    const profile = new Profile(
      user.fullName,
      user.passportNumber,
      user.identificationNumber,
      user.phone,
      user.email,
    );
    profile.role = user.role;
    return profile;
  }
}
