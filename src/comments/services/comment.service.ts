import { Injectable, Inject } from '@nestjs/common';

import { Model } from 'mongoose';

import { QueryListResult } from 'common/interfaces/query-list-result.interface';
import { CommentModelToken } from '../constants';
import { Comment } from '../interfaces/comment.interface';
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @Inject(CommentModelToken) private readonly commentModel: Model<Comment>,
  ) {}

  async create(
    postId: string,
    authorId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const createdPost = new this.commentModel(createCommentDto);
    return await createdPost.save();
  }

  async count(): Promise<number> {
    return await this.commentModel.countDocuments().exec();
  }

  async findAll(
    skip?: number,
    limit?: number,
  ): Promise<QueryListResult<Comment>> {
    const allComments = await this.commentModel
      .find()
      .skip(skip || 0)
      .limit(limit || 0)
      .exec();
    const numberOfPosts = await this.count();
    return {
      result: allComments,
      totalCount: numberOfPosts,
    };
  }

  async findAllForPost(
    postId: string,
    skip?: number,
    limit?: number,
  ): Promise<QueryListResult<Comment>> {
    const allPosts = await this.commentModel
      .find({ post: postId })
      .skip(skip || 0)
      .limit(limit || 0)
      .exec();
    const numberOfPosts = await this.count();
    return {
      result: allPosts,
      totalCount: numberOfPosts,
    };
  }

  async findOne(id: string): Promise<Comment> {
    return await this.commentModel.findOne({ _id: id }).exec();
  }

  async findOnePublished(id: string): Promise<Comment> {
    return await this.commentModel.findOne({ _id: id, published: true }).exec();
  }

  async updateOne(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return await this.commentModel.findByIdAndUpdate(id, updateCommentDto, {
      new: true,
    });
  }

  async delete(id: string): Promise<Comment> {
    return await this.commentModel.deleteOne({ _id: id }).exec();
  }
}
