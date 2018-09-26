import { Injectable, Inject } from '@nestjs/common';
import { PostModelToken } from '../constants';
import { Model } from 'mongoose';
import { Post } from '../interfaces/post.interface';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostModelToken) private readonly postModel: Model<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return await createdPost.save();
  }

  async findAll(): Promise<Post[]> {
    return await this.postModel.find().exec();
  }

  async findOne(id: string): Promise<Post> {
    return await this.postModel.findOne({ _id: id }).exec();
  }

  async findMany(ids: string[]): Promise<Post[]> {
    return await this.postModel.find({ _id: { $in: ids } }).exec();
  }

  async updateOne(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    return await this.postModel.findByIdAndUpdate(id, updatePostDto, {
      new: true,
    });
  }

  async delete(id: string): Promise<Post> {
    return await this.postModel.deleteOne({ _id: id }).exec();
  }
}
