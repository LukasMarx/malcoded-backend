import { Injectable, Inject } from '@nestjs/common';
import { UserModelToken } from '../constants';
import { Model } from 'mongoose';
import { User } from '../interfaces/user.interface';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { HashingService } from 'crypto/services/hashing.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserModelToken) private readonly userModel: Model<User>,
    private hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedUser = Object.assign(createUserDto, {
      password: await this.hashingService.hash(createUserDto.password),
    });
    const createdUser = new this.userModel(hashedUser);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: id }).exec();
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async confirmEmail(email: string): Promise<User> {
    return await this.userModel.findOneAndUpdate(
      { $set: { emailConfirmed: true } },
      email,
      {
        new: true,
      },
    );
  }

  async findMany(ids: string[]): Promise<User[]> {
    return await this.userModel.find({ _id: { $in: ids } }).exec();
  }

  async updateOne(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }

  async delete(id: string): Promise<User> {
    return await this.userModel.deleteOne({ _id: id }).exec();
  }
}
