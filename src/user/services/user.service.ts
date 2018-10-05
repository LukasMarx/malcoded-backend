import { Injectable, Inject } from '@nestjs/common';
import { UserModelToken } from '../constants';
import { Model } from 'mongoose';
import { User } from '../interfaces/user.interface';
import { CreateUserDto, UpdateUserDto, FromOAuthDto } from '../dto/user.dto';
import { HashingService } from '../../crypto/services/hashing.service';
import { QueryListResult } from '../../common/interfaces/query-list-result.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserModelToken) private readonly userModel: Model<User>,
    private hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedUser = Object.assign(createUserDto, {
      password: await this.hashingService.hash(createUserDto.password),
      provider: 'EMAIL',
    });
    const createdUser = new this.userModel(hashedUser);
    return await createdUser.save();
  }

  async createFromOAuth(fromOAuthDto: FromOAuthDto): Promise<User> {
    const hashedUser = Object.assign(fromOAuthDto, {
      isEmailVerified: true,
    });
    const result = await this.userModel
      .update(
        { email: fromOAuthDto.email, provider: fromOAuthDto.provider },
        hashedUser,
        { upsert: true, setDefaultsOnInsert: true, new: true },
      )
      .exec();

    return await this.findOneByEmail(fromOAuthDto.email, fromOAuthDto.provider);
  }

  async findAll(skip?: number, limit?: number): Promise<QueryListResult<User>> {
    const allUsers = await this.userModel
      .find()
      .skip(skip || 0)
      .limit(limit || 0)
      .exec();
    const userCount = await this.userModel.countDocuments().exec();
    return {
      result: allUsers,
      totalCount: userCount,
    };
  }

  async findOne(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: id }).exec();
  }

  async findOneByEmail(email: string, provider: string): Promise<User> {
    return await this.userModel.findOne({ email: email, provider }).exec();
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

  async findMany(
    ids: string[],
    skip?: number,
    limit?: number,
  ): Promise<QueryListResult<User>> {
    const allUsers = await this.userModel
      .find({ _id: { $in: ids } })
      .skip(skip || 0)
      .limit(limit || 0)
      .exec();
    const userCount = await this.userModel.countDocuments().exec();
    return {
      result: allUsers,
      totalCount: userCount,
    };
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
