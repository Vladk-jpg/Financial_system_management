import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { UserModel } from '../models/user.model';
import { User } from 'src/domain/entities/user';
import { Repository } from 'typeorm';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepo: Repository<UserModel>,
  ) {}
  async update(user: User): Promise<User | null> {
    const model = UserMapper.toModel(user);
    await this.userRepo.update(model.id, model);
    const newUser = await this.findById(model.id);
    return newUser ? newUser : null;
  }

  async findByPassport(passportNumber: string): Promise<User | null> {
    const userModel = await this.userRepo.findOne({
      where: { passportNumber: passportNumber },
    });
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async findById(id: number): Promise<User | null> {
    const userModel = await this.userRepo.findOne({ where: { id: id } });
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await this.userRepo.findOne({
      where: { email: email },
    });
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async create(user: User): Promise<User> {
    const model = UserMapper.toModel(user);
    const savedEntity = await this.userRepo.save(model);
    return UserMapper.toDomain(savedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }

  async findAllInactive(): Promise<User[]> {
    const users = await this.userRepo.find({
      where: { isActive: false },
    });
    return users.map(UserMapper.toDomain);
  }
}
