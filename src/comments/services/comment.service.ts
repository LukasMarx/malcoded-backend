import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { Model } from 'mongoose';

import { QueryListResult } from '../../common/interfaces/query-list-result.interface';
import { CommentModelToken } from '../constants';
import { Comment } from '../interfaces/comment.interface';
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto';
import { User } from '../../user/interfaces/user.interface';

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
    const model = Object.assign(createCommentDto, {
      author: authorId,
      post: postId,
    });
    const createdPost = new this.commentModel(model);
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
      .find({ post: postId, isAnswer: { $in: [null, false] } })
      .sort({ creationDate: -1 })
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
    user: User,
  ): Promise<Comment> {
    return await this.commentModel.findOneAndUpdate(
      { _id: id, author: user.id },
      updateCommentDto,
      {
        new: true,
      },
    );
  }

  async delete(id: string, user: User): Promise<Comment> {
    return await this.commentModel.findOneAndUpdate(
      { _id: id, author: user.id },
      {
        $unset: {
          author: '',
          content: '',
        },
        $set: {
          deleted: true,
        },
      },
    );
  }

  async deleteAnswer(commentId: string, answerId: string, user: User) {
    const result = await this.commentModel
      .deleteOne({ _id: answerId, author: user.id })
      .exec();

    if (result.n == 1 && result.ok == 1) {
      await this.commentModel
        .findByIdAndUpdate(commentId, {
          $pull: { answers: answerId },
        })
        .exec();

      return result;
    } else {
      throw new NotFoundException();
    }
  }

  async answerComment(
    commentId: string,
    authorId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) {
      throw new BadRequestException();
    }
    if (comment.isAnswer) {
      throw new BadRequestException();
    }
    const model = Object.assign(createCommentDto, {
      author: authorId,
      post: comment.post,
      isAnswer: true,
    });
    const createdPost = new this.commentModel(model);

    const answer = await createdPost.save();

    this.commentModel
      .findByIdAndUpdate(commentId, {
        $push: { answers: [answer.id] },
      })
      .exec();

    return answer;
  }

  async findMany(
    ids: string[],
    skip?: number,
    limit?: number,
  ): Promise<QueryListResult<Comment>> {
    const allComments = await this.commentModel
      .find({ _id: { $in: ids } })
      .sort({ creationDate: -1 })
      .skip(skip || 0)
      .limit(limit || 0)
      .exec();

    const numberOfComments = await this.commentModel
      .find({ _id: { $in: ids } })
      .countDocuments()
      .exec();

    return {
      result: allComments,
      totalCount: numberOfComments,
    };
  }
}
