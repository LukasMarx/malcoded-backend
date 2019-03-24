import { Injectable, Inject } from '@nestjs/common';
import { PostModelToken } from '../constants';
import { Model } from 'mongoose';
import { Post } from '../interfaces/post.interface';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { QueryListResult } from '../../common/interfaces/query-list-result.interface';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostModelToken) private readonly postModel: Model<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return await createdPost.save();
  }

  async count(): Promise<number> {
    return await this.postModel.countDocuments().exec();
  }

  async findAll(skip?: number, limit?: number): Promise<QueryListResult<Post>> {
    const allPosts = await this.postModel
      .find()
      .sort({ releaseDate: -1 })
      .skip(skip || 0)
      .limit(limit || 0)
      .exec();
    const numberOfPosts = await this.count();
    return {
      result: allPosts,
      totalCount: numberOfPosts,
    };
  }

  async findAllPublished(
    skip?: number,
    limit?: number,
    category?: string,
  ): Promise<QueryListResult<Post>> {
    const filter = { isPublic: true };
    if (category && category !== '') {
      filter['category'] = category;
    }
    const allPosts = await this.postModel
      .find(filter)
      .sort({ releaseDate: -1 })
      .skip(skip || 0)
      .limit(limit || 0)
      .exec();
    const numberOfPosts = await this.postModel.find(filter).countDocuments();
    return {
      result: allPosts,
      totalCount: numberOfPosts,
    };
  }

  async findOne(id: string): Promise<Post> {
    return await this.postModel.findOne({ _id: id }).exec();
  }

  async findOnePublished(url: string): Promise<Post> {
    return await this.postModel.findOne({ url: url, isPublic: true }).exec();
  }

  async findMany(
    ids: string[],
    skip?: number,
    limit?: number,
  ): Promise<QueryListResult<Post>> {
    const allPosts = await this.postModel
      .find({ _id: { $in: ids } })
      .skip(skip || 0)
      .limit(limit || 0)
      .exec();

    const numberOfPosts = await this.postModel
      .find({ _id: { $in: ids } })
      .countDocuments()
      .exec();

    return {
      result: allPosts,
      totalCount: numberOfPosts,
    };
  }

  async updateOne(id: string, updatePostDto: UpdatePostDto): Promise<void> {
    await this.postModel
      .findByIdAndUpdate(id, updatePostDto, {
        new: true,
      })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.postModel.deleteOne({ _id: id }).exec();
  }

  async release(id: string): Promise<Post> {
    return await this.postModel
      .findByIdAndUpdate(id, { $set: { isPublic: true } }, { new: true })
      .exec();
  }

  async takeDown(id: string): Promise<Post> {
    return await this.postModel
      .findByIdAndUpdate(id, { $set: { isPublic: false } }, { new: true })
      .exec();
  }
}
